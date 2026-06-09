import type maplibregl from "maplibre-gl"
import { useEffect, useRef } from "react"
import { useToast } from "#/features/ui"
import { useAnalytics } from "#/lib/analytics"
import { makeAreaPolygon } from "../area-geometry"
import { ELEMENT_TYPE_MAP, isLineStyle } from "../element-types"
import { syncElementsToMap } from "../elements-layer/map-elements-utils"
import {
	DRAW_LAYER_IDS,
	DRAW_SOURCE_IDS,
	hasLayer,
	removeLayersIfPresent,
	removeSourcesIfPresent,
	useMap,
} from "../fabric-map"
import {
	clearDrawingHistoryControls,
	setActiveElement,
	setActiveTool,
	setDrawingHistoryAvailability,
	setDrawingHistoryControls,
	setSelectedInstanceId,
	useFabricStore,
} from "../fabric-store"
import { flattenSegments, useRouteBetween } from "../osrm-utils"
import { validateDrawingConstraints } from "./drawing-constraints"
import {
	findNearestRoadLock,
	offsetPointAlongBearing,
	perpendicularBearing,
	projectPointOntoBearing,
	signedDistanceAlongBearing,
} from "./street-lock"

// ── Utilities ─────────────────────────────────────────────────────────────────

const EMPTY_LINE: GeoJSON.Feature<GeoJSON.LineString> = {
	type: "Feature",
	geometry: { type: "LineString", coordinates: [] },
	properties: {},
}

type DrawingSnapshot = {
	waypoints: [number, number][]
	segments: [number, number][][]
	lockedStreetBearing: number | null
	lockedMaxLengthFeet: number | null
	lockedStreetCenter: [number, number] | null
}

function makeLineFeature(
	coords: [number, number][],
): GeoJSON.Feature<GeoJSON.LineString> {
	return {
		type: "Feature",
		geometry: { type: "LineString", coordinates: coords },
		properties: {},
	}
}

function numericPropertyDefault(key: string, fallback: number) {
	return (descriptor: (typeof ELEMENT_TYPE_MAP)[string]) => {
		const prop = descriptor.properties.find((p) => p.key === key)
		const value = Number(prop?.default)
		return Number.isFinite(value) ? value : fallback
	}
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DrawingLayer() {
	const map = useMap()
	const { activeTool, activeElement, elements, addElement } = useFabricStore()
	const routeBetween = useRouteBetween()
	const { capture } = useAnalytics()
	const toast = useToast()
	const captureRef = useRef(capture)
	captureRef.current = capture

	// Mutable drawing state — lives in refs so map event handlers never go stale
	const waypointsRef = useRef<[number, number][]>([])
	const segmentsRef = useRef<[number, number][][]>([])
	const lockedStreetBearingRef = useRef<number | null>(null)
	const lockedMaxLengthFeetRef = useRef<number | null>(null)
	const lockedStreetCenterRef = useRef<[number, number] | null>(null)

	// Track which element IDs have layers on the map for diffing
	const elementLayerIds = useRef<Set<string>>(new Set())

	// ── Persistent drawing sources/layers ──────────────────────────────────
	useEffect(() => {
		map.addSource("draw-active", { type: "geojson", data: EMPTY_LINE })
		map.addLayer({
			id: "draw-active",
			type: "line",
			source: "draw-active",
			layout: { "line-join": "round", "line-cap": "round" },
			paint: { "line-color": "#3d8b37", "line-width": 4 },
		})
		map.addSource("draw-preview", { type: "geojson", data: EMPTY_LINE })
		map.addLayer({
			id: "draw-preview",
			type: "line",
			source: "draw-preview",
			layout: { "line-join": "round", "line-cap": "round" },
			paint: {
				"line-color": "#3d8b37",
				"line-width": 2.5,
				"line-dasharray": [8, 6],
				"line-opacity": 0.5,
			},
		})

		return () => {
			removeLayersIfPresent(map, DRAW_LAYER_IDS)
			removeSourcesIfPresent(map, DRAW_SOURCE_IDS)
		}
	}, [map])

	// ── Drawing interaction ─────────────────────────────────────────────────
	useEffect(() => {
		if (activeTool !== "draw" || !activeElement) return
		const element = activeElement
		const placement = element.placement ?? "multi-step"
		const style = element.baseMapStyle
		const lineStyle = isLineStyle(style) ? style : null
		const dp = lineStyle?.drawPreview

		map.getCanvas().style.cursor = "crosshair"
		map.doubleClickZoom.disable()

		// Update drawing layer paint to match the active element type
		if (hasLayer(map, "draw-active") && lineStyle) {
			map.setPaintProperty("draw-active", "line-color", lineStyle.color)
			map.setPaintProperty("draw-active", "line-width", lineStyle.width)
			if (lineStyle.dasharray) {
				map.setPaintProperty(
					"draw-active",
					"line-dasharray",
					lineStyle.dasharray,
				)
			}
		}
		if (hasLayer(map, "draw-preview") && dp) {
			map.setPaintProperty("draw-preview", "line-color", dp.color)
			map.setPaintProperty("draw-preview", "line-width", dp.width)
			map.setPaintProperty("draw-preview", "line-opacity", dp.opacity)
			map.setPaintProperty("draw-preview", "line-dasharray", dp.dasharray)
		}

		const lastClickTimeRef = { current: 0 }

		const activeSource = () =>
			map.getSource("draw-active") as maplibregl.GeoJSONSource | undefined
		const previewSource = () =>
			map.getSource("draw-preview") as maplibregl.GeoJSONSource | undefined
		const pastDrawingsRef = { current: [] as DrawingSnapshot[] }
		const futureDrawingsRef = { current: [] as DrawingSnapshot[] }

		function clonePoint(point: [number, number]): [number, number] {
			return [point[0], point[1]]
		}

		function cloneSegment(segment: [number, number][]): [number, number][] {
			return segment.map(clonePoint)
		}

		function snapshotDrawing(): DrawingSnapshot {
			return {
				waypoints: waypointsRef.current.map(clonePoint),
				segments: segmentsRef.current.map(cloneSegment),
				lockedStreetBearing: lockedStreetBearingRef.current,
				lockedMaxLengthFeet: lockedMaxLengthFeetRef.current,
				lockedStreetCenter: lockedStreetCenterRef.current
					? clonePoint(lockedStreetCenterRef.current)
					: null,
			}
		}

		function restoreDrawing(snapshot: DrawingSnapshot) {
			waypointsRef.current = snapshot.waypoints.map(clonePoint)
			segmentsRef.current = snapshot.segments.map(cloneSegment)
			lockedStreetBearingRef.current = snapshot.lockedStreetBearing
			lockedMaxLengthFeetRef.current = snapshot.lockedMaxLengthFeet
			lockedStreetCenterRef.current = snapshot.lockedStreetCenter
				? clonePoint(snapshot.lockedStreetCenter)
				: null
			updateActiveLine()
			previewSource()?.setData(EMPTY_LINE)
		}

		function syncDrawingHistoryAvailability() {
			setDrawingHistoryAvailability({
				canUndo: pastDrawingsRef.current.length > 0,
				canRedo: futureDrawingsRef.current.length > 0,
			})
		}

		function pushDrawingHistory() {
			pastDrawingsRef.current = [
				...pastDrawingsRef.current.slice(-49),
				snapshotDrawing(),
			]
			futureDrawingsRef.current = []
			syncDrawingHistoryAvailability()
		}

		function undoDrawingStep() {
			const previous = pastDrawingsRef.current.at(-1)
			if (!previous) return
			futureDrawingsRef.current = [
				snapshotDrawing(),
				...futureDrawingsRef.current,
			]
			pastDrawingsRef.current = pastDrawingsRef.current.slice(0, -1)
			restoreDrawing(previous)
			syncDrawingHistoryAvailability()
		}

		function redoDrawingStep() {
			const next = futureDrawingsRef.current[0]
			if (!next) return
			pastDrawingsRef.current = [...pastDrawingsRef.current, snapshotDrawing()]
			futureDrawingsRef.current = futureDrawingsRef.current.slice(1)
			restoreDrawing(next)
			syncDrawingHistoryAvailability()
		}

		if (placement !== "single-click") {
			setDrawingHistoryControls({
				undo: undoDrawingStep,
				redo: redoDrawingStep,
			})
			syncDrawingHistoryAvailability()
		}

		function ensureStreetLock(
			point: maplibregl.MapMouseEvent["point"],
			lngLat: [number, number],
		) {
			const perpendicularLock =
				element.drawingConstraints?.lockPerpendicularToStreet
			if (!perpendicularLock || lockedStreetBearingRef.current != null)
				return true

			const searchRadiusPx = Math.max(perpendicularLock.searchRadiusPx ?? 0, 48)
			const lock = findNearestRoadLock({
				map,
				point,
				lngLat,
				searchRadiusPx,
				fallbackMaxLengthFeet: element.drawingConstraints?.maxLengthFeet,
			})
			if (lock == null) return false
			lockedStreetBearingRef.current = lock.bearing
			lockedMaxLengthFeetRef.current = lock.suggestedMaxLengthFeet
			lockedStreetCenterRef.current = lock.centerPoint
			return true
		}

		function applyDrawingConstraints(
			start: [number, number],
			cursor: [number, number],
		): [number, number] {
			if (
				element.draw === "single-segment-perpendicular" &&
				lockedStreetBearingRef.current != null &&
				lockedStreetCenterRef.current != null
			) {
				const perp = perpendicularBearing(lockedStreetBearingRef.current)
				const center = lockedStreetCenterRef.current
				const halfLength =
					(lockedMaxLengthFeetRef.current ??
						element.drawingConstraints?.maxLengthFeet ??
						160) / 2
				const startSide = signedDistanceAlongBearing(center, start, perp)
				const cursorSide = signedDistanceAlongBearing(center, cursor, perp)
				const sign =
					Math.abs(startSide) > 1
						? Math.sign(startSide)
						: Math.sign(cursorSide) || 1
				return offsetPointAlongBearing(center, perp, -sign * halfLength)
			}

			const perpendicularLock =
				element.drawingConstraints?.lockPerpendicularToStreet
			const projected =
				perpendicularLock && lockedStreetBearingRef.current != null
					? projectPointOntoBearing(
							start,
							cursor,
							perpendicularBearing(lockedStreetBearingRef.current),
						)
					: cursor
			return projected
		}

		function currentCrossingStart(
			anchor: [number, number],
			cursor: [number, number],
		): [number, number] {
			if (
				element.draw === "single-segment-perpendicular" &&
				lockedStreetBearingRef.current != null &&
				lockedStreetCenterRef.current != null
			) {
				const perp = perpendicularBearing(lockedStreetBearingRef.current)
				const center = lockedStreetCenterRef.current
				const halfLength =
					(lockedMaxLengthFeetRef.current ??
						element.drawingConstraints?.maxLengthFeet ??
						160) / 2
				const anchorSide = signedDistanceAlongBearing(center, anchor, perp)
				const cursorSide = signedDistanceAlongBearing(center, cursor, perp)
				const sign =
					Math.abs(anchorSide) > 1
						? Math.sign(anchorSide)
						: Math.sign(cursorSide) || 1
				return offsetPointAlongBearing(center, perp, sign * halfLength)
			}
			return anchor
		}

		function updateActiveLine() {
			activeSource()?.setData(
				makeLineFeature(flattenSegments(segmentsRef.current)),
			)
		}

		function reset() {
			waypointsRef.current = []
			segmentsRef.current = []
			lockedStreetBearingRef.current = null
			lockedMaxLengthFeetRef.current = null
			lockedStreetCenterRef.current = null
			pastDrawingsRef.current = []
			futureDrawingsRef.current = []
			updateActiveLine()
			previewSource()?.setData(EMPTY_LINE)
			syncDrawingHistoryAvailability()
		}

		function commit() {
			const coords = flattenSegments(segmentsRef.current)
			if (coords.length < 2) {
				reset()
				return
			}

			const descriptor = ELEMENT_TYPE_MAP[element.id]
			const validation = validateDrawingConstraints(descriptor, coords)
			if (!validation.isValid) {
				toast.warning("Unable to draw element", {
					description: validation.message,
				})
				return
			}
			const newId = crypto.randomUUID()
			captureRef.current("editor_element_added", { element_type: element.id })
			addElement({
				id: newId,
				typeId: element.id,
				geometry: "line",
				coordinates: coords,
				waypoints: [...waypointsRef.current],
				segments: [...segmentsRef.current],
				properties: Object.fromEntries(
					descriptor.properties.map((p) => [p.key, p.default]),
				),
			})
			reset()
			// Switch back to select and select the newly created element so the
			// properties panel opens immediately. Done via store actions to avoid a
			// React 18 sync re-render clearing waypoint refs mid-event.
			setActiveTool("select")
			setActiveElement(null)
			setSelectedInstanceId(newId)
		}

		async function handleClick(e: maplibregl.MapMouseEvent) {
			if (element.draw === "single-click-point") {
				const descriptor = ELEMENT_TYPE_MAP[element.id]
				const point: [number, number] = [e.lngLat.lng, e.lngLat.lat]
				const newId = crypto.randomUUID()
				captureRef.current("editor_element_added", { element_type: element.id })
				addElement({
					id: newId,
					typeId: element.id,
					geometry: "point",
					coordinates: [point],
					waypoints: [point],
					segments: [],
					properties: Object.fromEntries(
						descriptor.properties.map((p) => [p.key, p.default]),
					),
				})
				reset()
				setActiveTool("select")
				setActiveElement(null)
				setSelectedInstanceId(newId)
				return
			}

			if (element.draw === "single-click-area") {
				const descriptor = ELEMENT_TYPE_MAP[element.id]
				const clicked: [number, number] = [e.lngLat.lng, e.lngLat.lat]
				const lock = findNearestRoadLock({
					map,
					point: e.point,
					lngLat: clicked,
					searchRadiusPx:
						element.drawingConstraints?.lockPerpendicularToStreet
							?.searchRadiusPx ?? 32,
				})
				if (!lock && element.areaPlacement?.requireStreet !== false) {
					toast.warning("Unable to place element", {
						description: "Click on or near a street to place this element.",
					})
					return
				}
				const center =
					element.areaPlacement?.anchor === "click"
						? clicked
						: (lock?.centerPoint ?? clicked)
				const bearing = lock?.bearing ?? map.getBearing()
				const diameterFeet = numericPropertyDefault("diameter", 36)(descriptor)
				const lengthFeet =
					descriptor.areaShape === "circle"
						? diameterFeet
						: numericPropertyDefault("length", 24)(descriptor)
				const widthFeet =
					descriptor.areaShape === "circle"
						? diameterFeet
						: numericPropertyDefault("width", 8)(descriptor)
				const coords = makeAreaPolygon({
					center,
					bearing,
					lengthFeet,
					widthFeet,
					shape: descriptor.areaShape,
				})
				const newId = crypto.randomUUID()
				captureRef.current("editor_element_added", { element_type: element.id })
				addElement({
					id: newId,
					typeId: element.id,
					geometry: "area",
					coordinates: coords,
					waypoints: [center],
					segments: [],
					properties: {
						...Object.fromEntries(
							descriptor.properties.map((p) => [p.key, p.default]),
						),
						bearing,
					},
				})
				reset()
				setActiveTool("select")
				setActiveElement(null)
				setSelectedInstanceId(newId)
				return
			}

			if (placement === "single-click") {
				const snapped: [number, number] = [e.lngLat.lng, e.lngLat.lat]
				if (!ensureStreetLock(e.point, snapped)) {
					toast.warning("Unable to place crossing", {
						description: "Click on or near a street to place a crossing.",
					})
					return
				}
				const startPoint = currentCrossingStart(snapped, snapped)
				const endPoint = applyDrawingConstraints(snapped, snapped)
				waypointsRef.current = [startPoint, endPoint]
				segmentsRef.current = [[startPoint, endPoint]]
				updateActiveLine()
				commit()
				return
			}

			const now = Date.now()
			if (now - lastClickTimeRef.current < 300) {
				lastClickTimeRef.current = 0
				commit()
				return
			}
			lastClickTimeRef.current = now

			const snapped: [number, number] = [e.lngLat.lng, e.lngLat.lat]
			const waypoints = waypointsRef.current

			if (waypoints.length === 0) {
				ensureStreetLock(e.point, snapped)
				pushDrawingHistory()
				waypointsRef.current = [snapped]
				return
			}

			const anchor = waypoints[waypoints.length - 1]
			if (!ensureStreetLock(e.point, snapped)) {
				toast.warning("Unable to place crossing", {
					description:
						"Draw the crossing over a street so it can lock perpendicular.",
				})
				return
			}
			const startPoint = currentCrossingStart(anchor, snapped)
			const constrained = applyDrawingConstraints(anchor, snapped)
			const segment =
				element.draw === "straight-line-points" ||
				element.draw === "single-segment-perpendicular"
					? [startPoint, constrained]
					: await routeBetween(anchor, constrained)
			pushDrawingHistory()
			waypointsRef.current =
				element.draw === "single-segment-perpendicular"
					? [startPoint, constrained]
					: [...waypoints, constrained]
			segmentsRef.current = [...segmentsRef.current, segment]
			updateActiveLine()
		}

		function handleMouseMove(e: maplibregl.MapMouseEvent) {
			if (waypointsRef.current.length === 0) return
			const last = waypointsRef.current[waypointsRef.current.length - 1]
			const cursor: [number, number] = [e.lngLat.lng, e.lngLat.lat]
			ensureStreetLock(e.point, cursor)
			const previewStart = currentCrossingStart(last, cursor)
			const previewEnd = applyDrawingConstraints(last, cursor)
			previewSource()?.setData(makeLineFeature([previewStart, previewEnd]))
		}

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") reset()
			if (e.key === "Enter" && placement !== "single-click") {
				commit()
			}
		}

		map.on("click", handleClick)
		map.on("mousemove", handleMouseMove)
		window.addEventListener("keydown", handleKeyDown)

		return () => {
			map.getCanvas().style.cursor = ""
			map.doubleClickZoom.enable()
			map.off("click", handleClick)
			map.off("mousemove", handleMouseMove)
			window.removeEventListener("keydown", handleKeyDown)
			clearDrawingHistoryControls()
			reset()
		}
	}, [activeTool, activeElement, map, addElement, routeBetween, toast])

	// ── Sync committed elements to map ─────────────────────────────────────
	useEffect(() => {
		syncElementsToMap({
			map,
			elements,
			elementLayerIds: elementLayerIds.current,
			belowLayerId: hasLayer(map, "draw-active") ? "draw-active" : undefined,
		})
	}, [elements, map])

	return null
}
