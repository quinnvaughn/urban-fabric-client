import type { ElementInstance } from "./element-types/types"

const EARTH_RADIUS_METERS = 6371008.8
const METERS_TO_FEET = 3.28084
const FEET_PER_MILE = 5280

function toRadians(degrees: number) {
	return (degrees * Math.PI) / 180
}

function segmentLengthMeters(a: [number, number], b: [number, number]): number {
	const [lng1, lat1] = a
	const [lng2, lat2] = b
	const dLat = toRadians(lat2 - lat1)
	const dLng = toRadians(lng2 - lng1)
	const lat1Rad = toRadians(lat1)
	const lat2Rad = toRadians(lat2)

	const sinLat = Math.sin(dLat / 2)
	const sinLng = Math.sin(dLng / 2)
	const haversine =
		sinLat * sinLat + Math.cos(lat1Rad) * Math.cos(lat2Rad) * sinLng * sinLng
	const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))

	return EARTH_RADIUS_METERS * c
}

export function lineLengthFeet(coordinates: [number, number][]): number {
	if (coordinates.length < 2) return 0

	let meters = 0
	for (let i = 1; i < coordinates.length; i += 1) {
		meters += segmentLengthMeters(coordinates[i - 1], coordinates[i])
	}

	return meters * METERS_TO_FEET
}

export function lineLengthMiles(coordinates: [number, number][]): number {
	return lineLengthFeet(coordinates) / FEET_PER_MILE
}

export type ElementTypeSummary = {
	typeId: string
	count: number
	totalLengthMiles: number
}

export function summarizeElementsByType(
	elements: ElementInstance[],
): ElementTypeSummary[] {
	const grouped = new Map<string, ElementTypeSummary>()

	for (const element of elements) {
		const existing = grouped.get(element.typeId)
		const lengthMiles =
			element.geometry === "line" ? lineLengthMiles(element.coordinates) : 0

		if (existing) {
			existing.count += 1
			existing.totalLengthMiles += lengthMiles
			continue
		}

		grouped.set(element.typeId, {
			typeId: element.typeId,
			count: 1,
			totalLengthMiles: lengthMiles,
		})
	}

	return [...grouped.values()]
}

const MILES_PRECISION = 2

export function formatMiles(miles: number) {
	return `${miles.toFixed(MILES_PRECISION)} mi`
}

export function totalElementLengthMiles(elements: ElementInstance[]): number {
	let total = 0
	for (const element of elements) {
		if (element.geometry === "line")
			total += lineLengthMiles(element.coordinates)
	}
	return total
}

export function getCalculatedValue(
	key: string,
	instance: ElementInstance,
	streetNames?: { from: string | null; to: string | null },
): string | number {
	if (key === "length") {
		if (instance.geometry !== "line") return "--"
		return formatLength(lineLengthFeet(instance.coordinates))
	}

	if (key === "lanes-removed") {
		const before = Number(instance.properties["lanes-before"])
		const after = Number(instance.properties["lanes-after"])
		if (Number.isFinite(before) && Number.isFinite(after)) {
			return Math.max(0, before - after)
		}
		return "--"
	}

	const points = instance.waypoints.length
		? instance.waypoints
		: instance.coordinates

	if (key === "from") {
		return streetNames?.from ?? formatCoordinate(points[0])
	}
	if (key === "to") {
		return streetNames?.to ?? formatCoordinate(points[points.length - 1])
	}

	if (key === "width-gained") {
		const before = Number(instance.properties["width-before"])
		const after = Number(instance.properties["width-after"])
		if (Number.isFinite(before) && Number.isFinite(after)) {
			return Math.max(0, after - before)
		}
		return "--"
	}

	return "--"
}

function formatLength(feet: number): string {
	if (feet < FEET_PER_MILE) {
		return `${Math.round(feet).toLocaleString()} ft`
	}
	const miles = feet / FEET_PER_MILE
	return `${miles >= 10 ? Math.round(miles) : Math.round(miles * 10) / 10} mi`
}

function formatCoordinate(coord?: [number, number]) {
	if (!coord) return "--"
	const [lng, lat] = coord
	return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
}

export function formatCalculatedValue(value: string | number, unit?: string) {
	if (typeof value !== "number") return value
	const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10
	return unit ? `${rounded} ${unit}` : String(rounded)
}
