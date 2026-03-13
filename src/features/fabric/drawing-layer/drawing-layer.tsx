import type maplibregl from "maplibre-gl"
import { useEffect, useRef } from "react"
import type { LinePaint } from "../element-types"
import { computeBasePaint, ELEMENT_TYPE_MAP } from "../element-types"
import type { LineLayerStyle } from "../element-types/types"
import { useMap } from "../fabric-map"
import { useFabricStore } from "../fabric-store"
import { flattenSegments, routeBetween, snapToRoad } from "../osrm-utils"

function computeCasingPaint(s: LineLayerStyle): LinePaint | null {
	if (!s.casingWidth) return null
	return {
		"line-color": s.color,
		"line-width": s.casingWidth,
		"line-opacity": s.casingOpacity ?? 0.15,
	}
}

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

// ── Layer ID helpers ──────────────────────────────────────────────────────────

const casingLayerId = (id: string) => `el-${id}-casing`
const mainLayerId = (id: string) => `el-${id}`
const casingSourceId = (id: string) => `el-${id}-casing`
const mainSourceId = (id: string) => `el-${id}`

function removeElementLayers(map: maplibregl.Map, id: string) {
	const layers = [casingLayerId(id), mainLayerId(id)]
	const sources = [casingSourceId(id), mainSourceId(id)]
	for (const l of layers) if (map.getLayer(l)) map.removeLayer(l)
	for (const s of sources) if (map.getSource(s)) map.removeSource(s)
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DrawingLayer() {
	const map = useMap()
	const activeTool = useFabricStore((s) => s.activeTool)
	const activeElement = useFabricStore((s) => s.activeElement)
	const elements = useFabricStore((s) => s.elements)
	const addElement = useFabricStore((s) => s.addElement)
	const setDrawHint = useFabricStore((s) => s.setDrawHint)

	// Mutable drawing state — lives in refs so map event handlers never go stale
	const waypointsRef = useRef<[number, number][]>([])
	const segmentsRef = useRef<[number, number][][]>([])
	const hintTimerRef = useRef<number | null>(null)

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
			if (map.getLayer("draw-preview")) map.removeLayer("draw-preview")
			if (map.getSource("draw-preview")) map.removeSource("draw-preview")
			if (map.getLayer("draw-active")) map.removeLayer("draw-active")
			if (map.getSource("draw-active")) map.removeSource("draw-active")
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
		if (map.getLayer("draw-active")) {
			map.setPaintProperty("draw-active", "line-color", style.color)
			map.setPaintProperty("draw-active", "line-width", style.width)
			if (style.dasharray) {
				map.setPaintProperty("draw-active", "line-dasharray", style.dasharray)
			}
		}
		if (map.getLayer("draw-preview") && dp) {
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
			addElement({
				id: crypto.randomUUID(),
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
			setDrawHint([
				`${descriptor.title} added`,
				"Switch to Select to edit properties",
				"Press E to select new element",
			])
			hintTimerRef.current = window.setTimeout(() => setDrawHint(null), 3500)
		}

		async function handleClick(e: maplibregl.MapMouseEvent) {
			if (hintTimerRef.current !== null) {
				clearTimeout(hintTimerRef.current)
				hintTimerRef.current = null
				setDrawHint(null)
			}
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
			if (hintTimerRef.current !== null) clearTimeout(hintTimerRef.current)
			reset()
		}
	}, [activeTool, activeElement, map, addElement, setDrawHint])

	// ── Sync committed elements to map ─────────────────────────────────────
	useEffect(() => {
		function sync() {
			const currentIds = new Set(elements.map((e) => e.id))

			// Remove layers for deleted elements
			for (const id of elementLayerIds.current) {
				if (!currentIds.has(id)) {
					removeElementLayers(map, id)
					elementLayerIds.current.delete(id)
				}
			}

			// Add or update layers for current elements
			for (const el of elements) {
				const descriptor = ELEMENT_TYPE_MAP[el.typeId]
				if (!descriptor) continue

				const data = makeLineFeature(el.coordinates)

				// ── Update existing sources ──────────────────────────────────────
				if (map.getSource(mainSourceId(el.id))) {
					;(
						map.getSource(mainSourceId(el.id)) as maplibregl.GeoJSONSource
					).setData(data)
					if (map.getSource(casingSourceId(el.id))) {
						;(
							map.getSource(casingSourceId(el.id)) as maplibregl.GeoJSONSource
						).setData(data)
					}
					// Re-apply paint in case properties changed
					if (map.getLayer(mainLayerId(el.id))) {
						const paint = computeBasePaint(descriptor, el)
						map.setPaintProperty(
							mainLayerId(el.id),
							"line-color",
							paint["line-color"],
						)
						map.setPaintProperty(
							mainLayerId(el.id),
							"line-width",
							paint["line-width"],
						)
						map.setPaintProperty(
							mainLayerId(el.id),
							"line-opacity",
							paint["line-opacity"],
						)
						// null explicitly clears the dasharray in MapLibre when not set
						map.setPaintProperty(
							mainLayerId(el.id),
							"line-dasharray",
							paint["line-dasharray"] ?? null,
						)
					}
					continue
				}

				// ── Add new layers ───────────────────────────────────────────────
				// Insert everything below the draw layers so new elements never
				// appear on top of an in-progress drawing.
				const belowLayer = map.getLayer("draw-active")
					? "draw-active"
					: undefined

				// 1. Casing — rendered beneath the main stroke
				const casingPaint = computeCasingPaint(descriptor.baseMapStyle)
				if (casingPaint) {
					map.addSource(casingSourceId(el.id), { type: "geojson", data })
					map.addLayer(
						{
							id: casingLayerId(el.id),
							type: "line",
							source: casingSourceId(el.id),
							layout: { "line-join": "round", "line-cap": "round" },
							paint: casingPaint,
						},
						belowLayer,
					)
				}

				// 2. Main stroke — on top of casing, below draw layers
				map.addSource(mainSourceId(el.id), { type: "geojson", data })
				map.addLayer(
					{
						id: mainLayerId(el.id),
						type: "line",
						source: mainSourceId(el.id),
						layout: {
							"line-join": descriptor.baseMapStyle.lineJoin ?? "round",
							"line-cap": descriptor.baseMapStyle.lineCap ?? "square",
						},
						paint: computeBasePaint(descriptor, el),
					},
					belowLayer,
				)

				elementLayerIds.current.add(el.id)
			}
		}

		sync()
	}, [elements, map])

	return null
}
