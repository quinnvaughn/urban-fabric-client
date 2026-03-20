import type maplibregl from "maplibre-gl"
import { useEffect, useRef } from "react"
import { ELEMENT_TYPE_MAP } from "../element-types"
import { syncElementsToMap } from "../elements-layer/map-elements-utils"
import {
	DRAW_LAYER_IDS,
	DRAW_SOURCE_IDS,
	hasLayer,
	removeLayersIfPresent,
	removeSourcesIfPresent,
	useMap,
} from "../fabric-map"
import { useFabricStore } from "../fabric-store"
import { flattenSegments, useRouteBetween, useSnapToRoad } from "../osrm-utils"

// ── Utilities ─────────────────────────────────────────────────────────────────

const EMPTY_LINE: GeoJSON.Feature<GeoJSON.LineString> = {
	type: "Feature",
	geometry: { type: "LineString", coordinates: [] },
	properties: {},
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

// ── Component ─────────────────────────────────────────────────────────────────

export function DrawingLayer() {
	const map = useMap()
	const activeTool = useFabricStore((s) => s.activeTool)
	const activeElement = useFabricStore((s) => s.activeElement)
	const elements = useFabricStore((s) => s.elements)
	const addElement = useFabricStore((s) => s.addElement)
	const snapToRoad = useSnapToRoad()
	const routeBetween = useRouteBetween()

	// Mutable drawing state — lives in refs so map event handlers never go stale
	const waypointsRef = useRef<[number, number][]>([])
	const segmentsRef = useRef<[number, number][][]>([])

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
		const style = element.baseMapStyle
		const dp = style.drawPreview

		map.getCanvas().style.cursor = "crosshair"
		map.doubleClickZoom.disable()

		// Update drawing layer paint to match the active element type
		if (hasLayer(map, "draw-active")) {
			map.setPaintProperty("draw-active", "line-color", style.color)
			map.setPaintProperty("draw-active", "line-width", style.width)
			if (style.dasharray) {
				map.setPaintProperty("draw-active", "line-dasharray", style.dasharray)
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

		function updateActiveLine() {
			activeSource()?.setData(
				makeLineFeature(flattenSegments(segmentsRef.current)),
			)
		}

		function reset() {
			waypointsRef.current = []
			segmentsRef.current = []
			updateActiveLine()
			previewSource()?.setData(EMPTY_LINE)
		}

		function commit() {
			const coords = flattenSegments(segmentsRef.current)
			if (coords.length < 2) {
				reset()
				return
			}

			const descriptor = ELEMENT_TYPE_MAP[element.id]
			const newId = crypto.randomUUID()
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
			// properties panel opens immediately. Done via getState() to avoid a
			// React 18/Zustand sync re-render clearing waypoint refs mid-event.
			const store = useFabricStore.getState()
			store.setActiveTool("select")
			store.setActiveElement(null)
			store.setSelectedInstanceId(newId)
		}

		async function handleClick(e: maplibregl.MapMouseEvent) {
			const now = Date.now()
			if (now - lastClickTimeRef.current < 300) {
				lastClickTimeRef.current = 0
				commit()
				return
			}
			lastClickTimeRef.current = now

			const snapped = await snapToRoad(e.lngLat.lng, e.lngLat.lat)
			const waypoints = waypointsRef.current

			if (waypoints.length === 0) {
				waypointsRef.current = [snapped]
				return
			}

			const prev = waypoints[waypoints.length - 1]
			const routed = await routeBetween(prev, snapped)
			waypointsRef.current = [...waypoints, snapped]
			segmentsRef.current = [...segmentsRef.current, routed]
			updateActiveLine()
		}

		function handleMouseMove(e: maplibregl.MapMouseEvent) {
			if (waypointsRef.current.length === 0) return
			const last = waypointsRef.current[waypointsRef.current.length - 1]
			previewSource()?.setData(
				makeLineFeature([last, [e.lngLat.lng, e.lngLat.lat]]),
			)
		}

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") reset()
			if (e.key === "Enter") commit()
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
			reset()
		}
	}, [activeTool, activeElement, map, addElement, snapToRoad, routeBetween])

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
