import type maplibregl from "maplibre-gl"

type Coord = [number, number]

type LocalPoint = {
	x: number
	y: number
}

const DEFAULT_SEARCH_RADIUS_PX = 18
const FEET_TO_METERS = 0.3048

export type StreetLock = {
	bearing: number
	suggestedMaxLengthFeet: number
	centerPoint: Coord
}

function toRadians(degrees: number) {
	return (degrees * Math.PI) / 180
}

function localScale(anchor: Coord) {
	const [, lat] = anchor
	return {
		lngMeters: 111_320 * Math.cos(toRadians(lat)),
		latMeters: 110_540,
	}
}

function toLocalPoint(anchor: Coord, coord: Coord): LocalPoint {
	const scale = localScale(anchor)
	return {
		x: (coord[0] - anchor[0]) * scale.lngMeters,
		y: (coord[1] - anchor[1]) * scale.latMeters,
	}
}

function fromLocalPoint(anchor: Coord, point: LocalPoint): Coord {
	const scale = localScale(anchor)
	return [anchor[0] + point.x / scale.lngMeters, anchor[1] + point.y / scale.latMeters]
}

function flattenLineCoordinates(
	geometry: GeoJSON.LineString | GeoJSON.MultiLineString,
): Coord[][] {
	if (geometry.type === "LineString") return [geometry.coordinates as Coord[]]
	return geometry.coordinates as Coord[][]
}

function distanceToSegmentMeters(
	anchor: Coord,
	point: Coord,
	start: Coord,
	end: Coord,
): { distance: number; bearing: number; nearestPoint: Coord } {
	const p = toLocalPoint(anchor, point)
	const a = toLocalPoint(anchor, start)
	const b = toLocalPoint(anchor, end)
	const dx = b.x - a.x
	const dy = b.y - a.y
	const lengthSquared = dx * dx + dy * dy
	if (lengthSquared === 0) {
		return {
			distance: Math.hypot(p.x - a.x, p.y - a.y),
			bearing: bearingBetween(start, end),
			nearestPoint: start,
		}
	}

	const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared))
	const closestX = a.x + dx * t
	const closestY = a.y + dy * t

	return {
		distance: Math.hypot(p.x - closestX, p.y - closestY),
		bearing: bearingBetween(start, end),
		nearestPoint: fromLocalPoint(anchor, { x: closestX, y: closestY }),
	}
}

function isEditorLayerId(id: string) {
	return (
		id.startsWith("el-") ||
		id.startsWith("draw-") ||
		id.startsWith("select-")
	)
}

function isIgnoredLineLayerId(id: string) {
	return /label|shield|name|text|path|pedestrian|footway|sidewalk|contour|boundary/i.test(
		id,
	)
}

export function isLikelyRoadFeature(
	feature: maplibregl.MapGeoJSONFeature,
): boolean {
	const layer = feature.layer
	if (!layer || layer.type !== "line") return false
	if (isEditorLayerId(layer.id) || isIgnoredLineLayerId(layer.id)) return false

	const geometry = feature.geometry as GeoJSON.Geometry | undefined
	return geometry?.type === "LineString" || geometry?.type === "MultiLineString"
}

function roadClass(feature: maplibregl.MapGeoJSONFeature): string {
	const props = (feature.properties ?? {}) as Record<string, unknown>
	const raw =
		props.class ?? props.highway ?? props.type ?? props.subclass ?? props.kind
	return typeof raw === "string" ? raw.toLowerCase() : ""
}

export function suggestedCrossingMaxLengthFeet(
	feature: maplibregl.MapGeoJSONFeature,
	fallback = 90,
): number {
	const klass = roadClass(feature)
	if (/(motorway|freeway|trunk|expressway)/i.test(klass)) return 160
	if (/(primary|arterial)/i.test(klass)) return 110
	if (/(secondary)/i.test(klass)) return 90
	if (/(tertiary|collector)/i.test(klass)) return 75
	if (/(residential|service|living_street|unclassified)/i.test(klass)) return 60
	return fallback
}

export function bearingBetween(start: Coord, end: Coord): number {
	const anchor = start
	const a = toLocalPoint(anchor, start)
	const b = toLocalPoint(anchor, end)
	const east = b.x - a.x
	const north = b.y - a.y
	if (east === 0 && north === 0) return 0
	return (Math.atan2(east, north) * 180) / Math.PI
}

export function projectPointOntoBearing(
	anchor: Coord,
	cursor: Coord,
	bearingDegrees: number,
): Coord {
	const vector = toLocalPoint(anchor, cursor)
	const theta = toRadians(bearingDegrees)
	const unitX = Math.sin(theta)
	const unitY = Math.cos(theta)
	const dot = vector.x * unitX + vector.y * unitY

	return fromLocalPoint(anchor, {
		x: unitX * dot,
		y: unitY * dot,
	})
}

export function clampPointToDistance(
	anchor: Coord,
	target: Coord,
	maxDistanceFeet: number,
): Coord {
	const maxDistanceMeters = maxDistanceFeet * FEET_TO_METERS
	const vector = toLocalPoint(anchor, target)
	const distance = Math.hypot(vector.x, vector.y)
	if (!Number.isFinite(maxDistanceMeters) || maxDistanceMeters <= 0) return anchor
	if (distance <= maxDistanceMeters || distance === 0) return target

	const scale = maxDistanceMeters / distance
	return fromLocalPoint(anchor, {
		x: vector.x * scale,
		y: vector.y * scale,
	})
}

export function offsetPointAlongBearing(
	anchor: Coord,
	bearingDegrees: number,
	distanceFeet: number,
): Coord {
	const distanceMeters = distanceFeet * FEET_TO_METERS
	const theta = toRadians(bearingDegrees)
	return fromLocalPoint(anchor, {
		x: Math.sin(theta) * distanceMeters,
		y: Math.cos(theta) * distanceMeters,
	})
}

export function signedDistanceAlongBearing(
	anchor: Coord,
	target: Coord,
	bearingDegrees: number,
): number {
	const vector = toLocalPoint(anchor, target)
	const theta = toRadians(bearingDegrees)
	const unitX = Math.sin(theta)
	const unitY = Math.cos(theta)
	return vector.x * unitX + vector.y * unitY
}

export function findNearestRoadLock(params: {
	map: maplibregl.Map
	point: maplibregl.MapMouseEvent["point"]
	lngLat: Coord
	searchRadiusPx?: number
	fallbackMaxLengthFeet?: number
}): StreetLock | null {
	const { map, point, lngLat, searchRadiusPx = DEFAULT_SEARCH_RADIUS_PX } = params
	const fallbackMaxLengthFeet = params.fallbackMaxLengthFeet ?? 90

	const bbox: [maplibregl.PointLike, maplibregl.PointLike] = [
		[point.x - searchRadiusPx, point.y - searchRadiusPx],
		[point.x + searchRadiusPx, point.y + searchRadiusPx],
	]
	const features = map.queryRenderedFeatures(bbox).filter(isLikelyRoadFeature)
	if (features.length === 0) return null

	let best:
		| {
				distance: number
				bearing: number
				nearestPoint: Coord
				feature: maplibregl.MapGeoJSONFeature
		  }
		| null = null

	for (const feature of features) {
		if (!feature.geometry) continue
		const geometry = feature.geometry as GeoJSON.Geometry
		if (geometry.type !== "LineString" && geometry.type !== "MultiLineString") continue

		for (const line of flattenLineCoordinates(geometry)) {
			for (let i = 1; i < line.length; i += 1) {
				const start = line[i - 1]
				const end = line[i]
				const candidate = distanceToSegmentMeters(lngLat, lngLat, start, end)
				if (!best || candidate.distance < best.distance) {
					best = {
						...candidate,
						feature,
					}
				}
			}
		}
	}

	if (!best) return null
		return {
			bearing: best.bearing,
			suggestedMaxLengthFeet: suggestedCrossingMaxLengthFeet(
				best.feature,
				fallbackMaxLengthFeet,
			),
			centerPoint: best.nearestPoint,
		}
}

export function normalizeBearing(bearing: number) {
	const normalized = bearing % 360
	return normalized < 0 ? normalized + 360 : normalized
}

export function perpendicularBearing(bearing: number) {
	return normalizeBearing(bearing + 90)
}
