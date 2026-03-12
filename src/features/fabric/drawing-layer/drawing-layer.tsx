import type maplibregl from "maplibre-gl"
import { useEffect, useRef } from "react"
import { ELEMENT_TYPE_MAP } from "../element-types"
import type { ElementDescriptor, ElementInstance } from "../element-types/types"

import { useMap } from "../fabric-map"
import { useFabricStore } from "../fabric-store"

type LinePaint = {
	"line-color"?: string
	"line-width"?: number
	"line-opacity"?: number
	"line-dasharray"?: number[]
}

const OSRM_BASE =
	import.meta.env.VITE_OSRM_URL ?? "https://router.project-osrm.org"

async function snapToRoad(lng: number, lat: number): Promise<[number, number]> {
	const res = await fetch(
		`${OSRM_BASE}/nearest/v1/driving/${lng},${lat}?number=1`,
	)
	const data = await res.json()
	return data.waypoints[0].location as [number, number]
}

async function routeBetween(
	a: [number, number],
	b: [number, number],
): Promise<[number, number][]> {
	const coords = `${a[0]},${a[1]};${b[0]},${b[1]}`
	const res = await fetch(
		`${OSRM_BASE}/route/v1/driving/${coords}?overview=full&geometries=geojson`,
	)
	const data = await res.json()
	return data.routes[0].geometry.coordinates as [number, number][]
}

function computePaint(
	descriptor: ElementDescriptor,
	instance: ElementInstance,
): LinePaint {
	const paint: LinePaint = {
		"line-color": descriptor.baseMapStyle.color,
		"line-width": descriptor.baseMapStyle.width,
		"line-opacity": descriptor.baseMapStyle.opacity ?? 1,
	}
	if (descriptor.baseMapStyle.dasharray) {
		paint["line-dasharray"] = descriptor.baseMapStyle.dasharray
	}
	for (const prop of descriptor.properties) {
		const value = instance.properties[prop.key] ?? prop.default
		Object.assign(paint, prop.toMapStyle(value))
	}
	return paint
}

// Joins routed segments into one coordinate array, avoiding duplicate junction points
function flattenSegments(segments: [number, number][][]): [number, number][] {
	return segments.flatMap((seg, i) => (i === 0 ? seg : seg.slice(1)))
}

const EMPTY_LINE: GeoJSON.Feature<GeoJSON.LineString> = {
	type: "Feature",
	geometry: { type: "LineString", coordinates: [] },
	properties: {},
}

export function DrawingLayer() {
	const map = useMap()
	const activeTool = useFabricStore((s) => s.activeTool)
	const activeElement = useFabricStore((s) => s.activeElement)
	const elements = useFabricStore((s) => s.elements)
	const addElement = useFabricStore((s) => s.addElement)

	// Mutable drawing state — lives in refs so map event handlers never go stale
	const waypointsRef = useRef<[number, number][]>([])
	const segmentsRef = useRef<[number, number][][]>([])

	// Track which element IDs have been added to the map for diffing
	const elementLayerIds = useRef<Set<string>>(new Set())

	// ── Persistent drawing sources/layers ────────────────────────────────────
	useEffect(() => {
		function setup() {
			if (!map.getSource("draw-active")) {
				map.addSource("draw-active", { type: "geojson", data: EMPTY_LINE })
				map.addLayer({
					id: "draw-active",
					type: "line",
					source: "draw-active",
					layout: { "line-join": "round", "line-cap": "round" },
					paint: { "line-color": "#0ea5e9", "line-width": 3 },
				})
			}
			if (!map.getSource("draw-preview")) {
				map.addSource("draw-preview", { type: "geojson", data: EMPTY_LINE })
				map.addLayer({
					id: "draw-preview",
					type: "line",
					source: "draw-preview",
					layout: { "line-join": "round", "line-cap": "round" },
					paint: {
						"line-color": "#0ea5e9",
						"line-width": 2,
						"line-dasharray": [4, 2],
						"line-opacity": 0.7,
					},
				})
			}
		}

		if (map.isStyleLoaded()) setup()
		else map.once("styledata", setup)

		return () => {
			if (map.getLayer("draw-preview")) map.removeLayer("draw-preview")
			if (map.getSource("draw-preview")) map.removeSource("draw-preview")
			if (map.getLayer("draw-active")) map.removeLayer("draw-active")
			if (map.getSource("draw-active")) map.removeSource("draw-active")
		}
	}, [map])

	// ── Drawing interaction ───────────────────────────────────────────────────
	useEffect(() => {
		if (activeTool !== "draw" || !activeElement) return
		const element = activeElement

		map.getCanvas().style.cursor = "crosshair"
		map.doubleClickZoom.disable()

		// Update drawing layer colors to match the selected element
		if (map.getLayer("draw-active")) {
			map.setPaintProperty("draw-active", "line-color", element.baseMapStyle.color)
			map.setPaintProperty("draw-active", "line-width", element.baseMapStyle.width)
			map.setPaintProperty("draw-preview", "line-color", element.baseMapStyle.color)
		}

		const lastClickTimeRef = { current: 0 }

		const activeSource = () =>
			map.getSource("draw-active") as maplibregl.GeoJSONSource | undefined
		const previewSource = () =>
			map.getSource("draw-preview") as maplibregl.GeoJSONSource | undefined

		function updateActiveLine() {
			activeSource()?.setData({
				type: "Feature",
				geometry: {
					type: "LineString",
					coordinates: flattenSegments(segmentsRef.current),
				},
				properties: {},
			})
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
				properties: Object.fromEntries(
					descriptor.properties.map((p) => [p.key, p.default]),
				),
			})
			reset()
		}

		async function handleClick(e: maplibregl.MapMouseEvent) {
			const now = Date.now()
			if (now - lastClickTimeRef.current < 300) {
				// Second click within 300ms — treat as double-click, commit
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
			previewSource()?.setData({
				type: "Feature",
				geometry: {
					type: "LineString",
					coordinates: [last, [e.lngLat.lng, e.lngLat.lat]],
				},
				properties: {},
			})
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
	}, [activeTool, activeElement, map, addElement])

	// ── Sync committed elements to map ───────────────────────────────────────
	useEffect(() => {
		const currentIds = new Set(elements.map((e) => e.id))

		// Remove layers for deleted elements
		for (const id of elementLayerIds.current) {
			if (!currentIds.has(id)) {
				if (map.getLayer(`el-${id}`)) map.removeLayer(`el-${id}`)
				if (map.getSource(`el-${id}`)) map.removeSource(`el-${id}`)
				elementLayerIds.current.delete(id)
			}
		}

		// Add or update layers for current elements
		for (const el of elements) {
			const descriptor = ELEMENT_TYPE_MAP[el.typeId]
			if (!descriptor) continue

			const sourceId = `el-${el.id}`
			const data: GeoJSON.Feature<GeoJSON.LineString> = {
				type: "Feature",
				geometry: { type: "LineString", coordinates: el.coordinates },
				properties: {},
			}

			if (map.getSource(sourceId)) {
				;(map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(data)
			} else {
				map.addSource(sourceId, { type: "geojson", data })
				// Insert below drawing layers if they exist, otherwise add on top
				map.addLayer(
					{
						id: sourceId,
						type: "line",
						source: sourceId,
						layout: { "line-join": "round", "line-cap": "round" },
						paint: computePaint(descriptor, el),
					},
					map.getLayer("draw-active") ? "draw-active" : undefined,
				)
				elementLayerIds.current.add(el.id)
			}
		}
	}, [elements, map])

	return null
}
