import type maplibregl from "maplibre-gl"
import { useEffect, useRef } from "react"
import { computeBasePaint, ELEMENT_TYPE_MAP } from "../element-types"
import {
	removeLayersIfPresent,
	removeSourcesIfPresent,
	SELECT_LAYER_IDS,
	SELECT_SOURCE_IDS,
	useMap,
} from "../fabric-map"
import { fabricStore, useFabricStore } from "../fabric-store"
import { flattenSegments, useRouteBetween } from "../osrm-utils"

const EMPTY_LINE: GeoJSON.Feature<GeoJSON.LineString> = {
	type: "Feature",
	geometry: { type: "LineString", coordinates: [] },
	properties: {},
}

const EMPTY_MULTIPOINT: GeoJSON.Feature<GeoJSON.MultiPoint> = {
	type: "Feature",
	geometry: { type: "MultiPoint", coordinates: [] },
	properties: {},
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function closestWaypointIndex(
	waypoints: [number, number][],
	pos: [number, number],
): number {
	let minDist = Infinity
	let minIdx = 0
	for (let i = 0; i < waypoints.length; i++) {
		const dx = waypoints[i][0] - pos[0]
		const dy = waypoints[i][1] - pos[1]
		const d = dx * dx + dy * dy
		if (d < minDist) {
			minDist = d
			minIdx = i
		}
	}
	return minIdx
}

function shouldRouteAlongRoads(typeId: string): boolean {
	return ELEMENT_TYPE_MAP[typeId]?.draw === "click-to-place-points"
}

function straightSegmentsFromWaypoints(
	waypoints: [number, number][],
): [number, number][][] {
	const segments: [number, number][][] = []
	for (let i = 0; i < waypoints.length - 1; i++) {
		segments.push([waypoints[i], waypoints[i + 1]])
	}
	return segments
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SelectLayer() {
	const map = useMap()
	const {
		activeTool,
		elements,
		selectedInstanceId,
		setSelectedInstanceId,
		deleteElement,
		updateElement,
		snapshot,
	} = useFabricStore()
	const routeBetween = useRouteBetween()

	const dragging = useRef<{
		waypointIndex: number
		elementId: string
		ready: boolean
	} | null>(null)
	const hasDragged = useRef(false)
	const routeDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)
	const routeCallId = useRef(0)

	// ── Persistent selection sources/layers ──────────────────────────────────
	useEffect(() => {
		map.addSource("select-line", { type: "geojson", data: EMPTY_LINE })
		map.addSource("select-endpoints", {
			type: "geojson",
			data: EMPTY_MULTIPOINT,
		})

		// Line layers first so circles and handle render on top of them

		map.addLayer({
			id: "select-outline-below",
			type: "line",
			source: "select-line",
			layout: { "line-join": "round", "line-cap": "butt" },
			paint: {
				"line-color": "#000000",
				"line-opacity": 0,
				"line-width": 1.5,
				"line-offset": -9,
				"line-color-transition": { duration: 0, delay: 0 },
				"line-opacity-transition": { duration: 0, delay: 0 },
			},
		})
		map.addLayer({
			id: "select-outline-above",
			type: "line",
			source: "select-line",
			layout: { "line-join": "round", "line-cap": "butt" },
			paint: {
				"line-color": "#000000",
				"line-opacity": 0,
				"line-width": 1.5,
				"line-offset": 9,
				"line-color-transition": { duration: 0, delay: 0 },
				"line-opacity-transition": { duration: 0, delay: 0 },
			},
		})
		map.addLayer({
			id: "select-main",
			type: "line",
			source: "select-line",
			layout: { "line-join": "round", "line-cap": "round" },
			paint: {
				"line-color": "#000000",
				"line-opacity": 0,
				"line-width": 4,
				"line-color-transition": { duration: 0, delay: 0 },
				"line-opacity-transition": { duration: 0, delay: 0 },
			},
		})

		// Drag preview — straight-line ghost shown while OSRM routes in the background
		map.addSource("select-drag-preview", { type: "geojson", data: EMPTY_LINE })
		map.addLayer({
			id: "select-drag-preview",
			type: "line",
			source: "select-drag-preview",
			layout: { "line-join": "round", "line-cap": "round" },
			paint: {
				"line-color": "#000000",
				"line-width": 2,
				"line-dasharray": [6, 5],
				"line-opacity": 0.45,
				"line-color-transition": { duration: 0, delay: 0 },
			},
		})

		// Endpoint circles — added after line layers so they sit on top
		map.addLayer({
			id: "select-endpoints-snap-ring",
			type: "circle",
			source: "select-endpoints",
			paint: {
				"circle-radius": 13,
				"circle-color": "transparent",
				"circle-stroke-color": "#000000",
				"circle-stroke-width": 1.5,
				"circle-opacity": 0,
				"circle-stroke-opacity": 0,
				"circle-color-transition": { duration: 0, delay: 0 },
				"circle-stroke-color-transition": { duration: 0, delay: 0 },
				"circle-opacity-transition": { duration: 0, delay: 0 },
				"circle-stroke-opacity-transition": { duration: 0, delay: 0 },
			},
		})
		map.addLayer({
			id: "select-endpoints-glow",
			type: "circle",
			source: "select-endpoints",
			paint: {
				"circle-radius": 9,
				"circle-color": "#000000",
				"circle-opacity": 0,
				"circle-color-transition": { duration: 0, delay: 0 },
				"circle-opacity-transition": { duration: 0, delay: 0 },
			},
		})
		map.addLayer({
			id: "select-endpoints-node",
			type: "circle",
			source: "select-endpoints",
			paint: {
				"circle-radius": 5.5,
				"circle-color": "#ffffff",
				"circle-stroke-color": "#000000",
				"circle-stroke-width": 2,
				"circle-opacity": 0,
				"circle-stroke-opacity": 0,
				"circle-color-transition": { duration: 0, delay: 0 },
				"circle-stroke-color-transition": { duration: 0, delay: 0 },
				"circle-opacity-transition": { duration: 0, delay: 0 },
				"circle-stroke-opacity-transition": { duration: 0, delay: 0 },
			},
		})

		return () => {
			removeLayersIfPresent(map, SELECT_LAYER_IDS)
			removeSourcesIfPresent(map, SELECT_SOURCE_IDS)
		}
	}, [map])

	// ── Sync selection visuals to selected element ────────────────────────────
	useEffect(() => {
		const lineSource = map.getSource("select-line") as
			| maplibregl.GeoJSONSource
			| undefined
		const pointSource = map.getSource("select-endpoints") as
			| maplibregl.GeoJSONSource
			| undefined
		if (!lineSource || !pointSource) return

		const el = elements.find((e) => e.id === selectedInstanceId)
		const descriptor = el ? ELEMENT_TYPE_MAP[el.typeId] : undefined
		const s = descriptor?.baseMapStyle
		const computedPaint =
			el && descriptor ? computeBasePaint(descriptor, el) : undefined
		const sel = s?.selected
		const ep = s?.endpoints

		if (!el || !s || !sel) {
			lineSource.setData(EMPTY_LINE)
			pointSource.setData(EMPTY_MULTIPOINT)
			map.setPaintProperty("select-main", "line-opacity", 0)
			map.setPaintProperty("select-outline-above", "line-opacity", 0)
			map.setPaintProperty("select-outline-below", "line-opacity", 0)
			map.setPaintProperty("select-endpoints-node", "circle-opacity", 0)
			map.setPaintProperty("select-endpoints-node", "circle-stroke-opacity", 0)
			map.setPaintProperty("select-endpoints-glow", "circle-opacity", 0)
			map.setPaintProperty(
				"select-endpoints-snap-ring",
				"circle-stroke-opacity",
				0,
			)
			return
		}

		// Update paint/layout properties BEFORE swapping geometry so the new
		// colors are already applied when the re-render fires. Without this ordering
		// MapLibre renders the new geometry for one frame with the old line's colors.
		map.setPaintProperty("select-main", "line-opacity", 0)
		map.setPaintProperty("select-outline-above", "line-opacity", 0)
		map.setPaintProperty("select-outline-below", "line-opacity", 0)
		map.setPaintProperty("select-endpoints-node", "circle-opacity", 0)
		map.setPaintProperty("select-endpoints-node", "circle-stroke-opacity", 0)
		map.setPaintProperty("select-endpoints-glow", "circle-opacity", 0)
		map.setPaintProperty(
			"select-endpoints-snap-ring",
			"circle-stroke-opacity",
			0,
		)
		map.setPaintProperty(
			"select-drag-preview",
			"line-color",
			sel.color ?? computedPaint?.["line-color"] ?? s.color,
		)
		const hasDashedMain = Boolean(computedPaint?.["line-dasharray"]?.length)
		map.setPaintProperty(
			"select-main",
			"line-color",
			sel.color ?? computedPaint?.["line-color"] ?? s.color,
		)
		map.setPaintProperty(
			"select-main",
			"line-width",
			sel.width ?? computedPaint?.["line-width"] ?? s.width,
		)
		map.setPaintProperty(
			"select-main",
			"line-dasharray",
			computedPaint?.["line-dasharray"] ?? null,
		)
		map.setLayoutProperty(
			"select-main",
			"line-cap",
			sel.lineCap ?? s.lineCap ?? "round",
		)

		// Outlines
		const outlineOpacity = sel.outlineOpacity ?? 0.85
		const outlineWidth = sel.outlineWidth ?? 1.5
		const offset = sel.outlineOffset ?? 8

		map.setPaintProperty(
			"select-outline-above",
			"line-color",
			computedPaint?.["line-color"] ?? s.color,
		)
		map.setPaintProperty("select-outline-above", "line-width", outlineWidth)
		map.setPaintProperty("select-outline-above", "line-offset", offset)
		map.setPaintProperty(
			"select-outline-below",
			"line-color",
			computedPaint?.["line-color"] ?? s.color,
		)
		map.setPaintProperty("select-outline-below", "line-width", outlineWidth)
		map.setPaintProperty("select-outline-below", "line-offset", -offset)
		if (sel.outlineDasharray) {
			map.setPaintProperty(
				"select-outline-above",
				"line-dasharray",
				sel.outlineDasharray,
			)
			map.setPaintProperty(
				"select-outline-below",
				"line-dasharray",
				sel.outlineDasharray,
			)
		} else {
			map.setPaintProperty("select-outline-above", "line-dasharray", null)
			map.setPaintProperty("select-outline-below", "line-dasharray", null)
		}

		// Endpoints
		if (ep) {
			map.setPaintProperty("select-endpoints-node", "circle-radius", ep.radius)
			map.setPaintProperty(
				"select-endpoints-node",
				"circle-color",
				ep.fillColor,
			)
			map.setPaintProperty(
				"select-endpoints-node",
				"circle-stroke-color",
				computedPaint?.["line-color"] ?? s.color,
			)
			map.setPaintProperty(
				"select-endpoints-node",
				"circle-stroke-width",
				ep.strokeWidth,
			)
			map.setPaintProperty(
				"select-endpoints-glow",
				"circle-radius",
				ep.glowRadius,
			)
			map.setPaintProperty(
				"select-endpoints-glow",
				"circle-color",
				computedPaint?.["line-color"] ?? s.color,
			)
			map.setPaintProperty(
				"select-endpoints-glow",
				"circle-opacity",
				ep.glowOpacity,
			)
			map.setPaintProperty(
				"select-endpoints-snap-ring",
				"circle-radius",
				ep.snapRingRadius,
			)
			map.setPaintProperty(
				"select-endpoints-snap-ring",
				"circle-stroke-color",
				computedPaint?.["line-color"] ?? s.color,
			)
			map.setPaintProperty(
				"select-endpoints-snap-ring",
				"circle-stroke-width",
				ep.snapRingWidth,
			)
		} else {
			map.setPaintProperty("select-endpoints-node", "circle-opacity", 0)
			map.setPaintProperty("select-endpoints-node", "circle-stroke-opacity", 0)
			map.setPaintProperty("select-endpoints-glow", "circle-opacity", 0)
			map.setPaintProperty(
				"select-endpoints-snap-ring",
				"circle-stroke-opacity",
				0,
			)
		}

		// Geometry — updated last so all paint/style properties are already
		// applied before MapLibre renders the new geometry.
		lineSource.setData({
			type: "Feature",
			geometry: { type: "LineString", coordinates: el.coordinates },
			properties: {},
		})
		pointSource.setData({
			type: "Feature",
			geometry: { type: "MultiPoint", coordinates: el.waypoints },
			properties: {},
		})

		map.setPaintProperty("select-outline-above", "line-opacity", outlineOpacity)
		map.setPaintProperty("select-outline-below", "line-opacity", outlineOpacity)
		map.setPaintProperty("select-main", "line-opacity", hasDashedMain ? 0 : 1)
		if (ep) {
			map.setPaintProperty("select-endpoints-node", "circle-opacity", 1)
			map.setPaintProperty("select-endpoints-node", "circle-stroke-opacity", 1)
			map.setPaintProperty(
				"select-endpoints-glow",
				"circle-opacity",
				ep.glowOpacity,
			)
			map.setPaintProperty(
				"select-endpoints-snap-ring",
				"circle-stroke-opacity",
				ep.snapRingOpacity,
			)
		}
	}, [map, selectedInstanceId, elements])

	// ── Clear selection when leaving select mode ──────────────────────────────
	useEffect(() => {
		if (activeTool !== "select") setSelectedInstanceId(null)
	}, [activeTool, setSelectedInstanceId])

	// ── Select-mode interactions ──────────────────────────────────────────────
	useEffect(() => {
		if (activeTool !== "select") return

		map.getCanvas().style.cursor = ""

		function elementLayerIds() {
			return map
				.getStyle()
				.layers.filter(
					(l) => l.id.startsWith("el-") && !l.id.endsWith("-casing"),
				)
				.map((l) => l.id)
		}

		const HIT_RADIUS = 6

		function handleClick(e: maplibregl.MapMouseEvent) {
			// Suppress click that ends a drag
			if (hasDragged.current) {
				hasDragged.current = false
				return
			}
			// Don't deselect when clicking on a handle
			const handleHit = map.queryRenderedFeatures(e.point, {
				layers: ["select-endpoints-node"],
			})
			if (handleHit.length > 0) return

			const layers = elementLayerIds()
			if (layers.length === 0) {
				setSelectedInstanceId(null)
				return
			}
			const bbox: [maplibregl.PointLike, maplibregl.PointLike] = [
				[e.point.x - HIT_RADIUS, e.point.y - HIT_RADIUS],
				[e.point.x + HIT_RADIUS, e.point.y + HIT_RADIUS],
			]
			const features = map.queryRenderedFeatures(bbox, { layers })
			if (features.length === 0) {
				setSelectedInstanceId(null)
				return
			}
			const instanceId = features[0].layer.id.replace(/^el-/, "")
			setSelectedInstanceId(instanceId)
		}

		function handleMouseDown(e: maplibregl.MapMouseEvent) {
			const { selectedInstanceId, elements } = fabricStore.state
			if (!selectedInstanceId) return
			const el = elements.find((el) => el.id === selectedInstanceId)
			if (!el) return

			// ── Endpoint drag ────────────────────────────────────────────────
			const endpointHit = map.queryRenderedFeatures(e.point, {
				layers: ["select-endpoints-node"],
			})
			if (endpointHit.length > 0) {
				const idx = closestWaypointIndex(el.waypoints, [
					e.lngLat.lng,
					e.lngLat.lat,
				])
				dragging.current = { waypointIndex: idx, elementId: el.id, ready: true }
				map.dragPan.disable()
				map.getCanvas().style.cursor = "grabbing"
				return
			}
		}

		// Map-level mousemove: cursor hover feedback only (not used during drag)
		function handleMapMouseMove(e: maplibregl.MapMouseEvent) {
			if (dragging.current) return
			const endpointHit = map.queryRenderedFeatures(e.point, {
				layers: ["select-endpoints-node"],
			})
			if (endpointHit.length > 0) {
				map.getCanvas().style.cursor = "grab"
				return
			}
			// Also show a pointer when hovering over any element line
			const layers = elementLayerIds()
			const lineHoverBbox: [maplibregl.PointLike, maplibregl.PointLike] = [
				[e.point.x - HIT_RADIUS, e.point.y - HIT_RADIUS],
				[e.point.x + HIT_RADIUS, e.point.y + HIT_RADIUS],
			]
			const lineHit =
				layers.length > 0
					? map.queryRenderedFeatures(lineHoverBbox, { layers })
					: []
			map.getCanvas().style.cursor = lineHit.length > 0 ? "pointer" : ""
		}

		// Window-level mousemove: drag tracking. Uses map.unproject so events are
		// received even when MapLibre's gesture system swallows map-level events.
		function handleWindowMouseMove(e: MouseEvent) {
			if (!dragging.current?.ready) return

			const { selectedInstanceId, elements } = fabricStore.state
			if (!selectedInstanceId) return
			const el = elements.find((el) => el.id === selectedInstanceId)
			if (!el) return

			const rect = map.getCanvas().getBoundingClientRect()
			const lngLat = map.unproject([
				e.clientX - rect.left,
				e.clientY - rect.top,
			])
			const cursorPos: [number, number] = [lngLat.lng, lngLat.lat]

			const { waypointIndex } = dragging.current
			hasDragged.current = true

			// ── Immediate preview ─────────────────────────────────────────────
			// Move the endpoint circle to the cursor right away so the drag feels
			// responsive before OSRM resolves.
			const waypoints = [...el.waypoints] as [number, number][]
			const previewCoords: [number, number][] = []
			if (waypointIndex > 0) previewCoords.push(waypoints[waypointIndex - 1])
			previewCoords.push(cursorPos)
			if (waypointIndex < waypoints.length - 1)
				previewCoords.push(waypoints[waypointIndex + 1])

			const previewSrc = map.getSource("select-drag-preview") as
				| maplibregl.GeoJSONSource
				| undefined
			previewSrc?.setData({
				type: "Feature",
				geometry: { type: "LineString", coordinates: previewCoords },
				properties: {},
			})

			const endpointSrc = map.getSource("select-endpoints") as
				| maplibregl.GeoJSONSource
				| undefined
			const previewWaypoints = [...waypoints]
			previewWaypoints[waypointIndex] = cursorPos
			endpointSrc?.setData({
				type: "Feature",
				geometry: { type: "MultiPoint", coordinates: previewWaypoints },
				properties: {},
			})

			if (!shouldRouteAlongRoads(el.typeId)) {
				if (routeDebounce.current) {
					clearTimeout(routeDebounce.current)
					routeDebounce.current = null
				}
				const straightSegments = straightSegmentsFromWaypoints(previewWaypoints)
				previewSrc?.setData(EMPTY_LINE)
				updateElement(el.id, {
					waypoints: previewWaypoints,
					segments: straightSegments,
					coordinates: flattenSegments(straightSegments),
				})
				return
			}

			// ── OSRM routing (debounced) ──────────────────────────────────────
			// Fires 80 ms after the last mousemove so rapid movement only triggers
			// one route call per "pause" rather than on every frame.
			if (routeDebounce.current) clearTimeout(routeDebounce.current)
			const capturedCursor = cursorPos
			const capturedWaypointIndex = waypointIndex

			routeDebounce.current = setTimeout(async () => {
				// Increment inside the timeout so only actual OSRM call starts are
				// counted — not every mousemove. This prevents valid results from being
				// discarded just because the cursor moved during the OSRM round-trip.
				const callId = ++routeCallId.current
				// Read fresh element state so we use the latest routed segments
				const { selectedInstanceId: sid, elements: els } = fabricStore.state
				if (!sid) return
				const fresh = els.find((el) => el.id === sid)
				if (!fresh) return

				const freshWaypoints = [...fresh.waypoints] as [number, number][]
				const freshSegments = [
					...(fresh.segments?.length ? fresh.segments : [fresh.coordinates]),
				] as [number, number][][]

				try {
					const snapped = capturedCursor
					freshWaypoints[capturedWaypointIndex] = snapped

					const reroutes: Promise<void>[] = []
					if (capturedWaypointIndex > 0) {
						reroutes.push(
							routeBetween(
								freshWaypoints[capturedWaypointIndex - 1],
								snapped,
							).then((seg) => {
								freshSegments[capturedWaypointIndex - 1] = seg
							}),
						)
					}
					if (capturedWaypointIndex < freshWaypoints.length - 1) {
						reroutes.push(
							routeBetween(
								snapped,
								freshWaypoints[capturedWaypointIndex + 1],
							).then((seg) => {
								freshSegments[capturedWaypointIndex] = seg
							}),
						)
					}
					await Promise.all(reroutes)

					// Discard if a newer call has already been queued
					if (callId !== routeCallId.current) return

					previewSrc?.setData(EMPTY_LINE)
					updateElement(fresh.id, {
						waypoints: freshWaypoints,
						segments: freshSegments,
						coordinates: flattenSegments(freshSegments),
					})
				} catch {
					// OSRM unavailable — preview stays until the next successful call
				}
			}, 80)
		}

		function handleMouseUp() {
			if (!dragging.current) return
			if (hasDragged.current) snapshot()
			hasDragged.current = false
			dragging.current = null
			if (routeDebounce.current) {
				clearTimeout(routeDebounce.current)
				routeDebounce.current = null
			}
			map.dragPan.enable()
			map.getCanvas().style.cursor = ""
			;(
				map.getSource("select-drag-preview") as
					| maplibregl.GeoJSONSource
					| undefined
			)?.setData(EMPTY_LINE)
			// Revert endpoint circles to the store's actual waypoints in case
			// routing failed and the preview circle is stuck at the drag position.
			const { selectedInstanceId: sid, elements: els } = fabricStore.state
			const actual = sid ? els.find((e) => e.id === sid) : undefined
			;(
				map.getSource("select-endpoints") as
					| maplibregl.GeoJSONSource
					| undefined
			)?.setData(
				actual
					? {
							type: "Feature",
							geometry: { type: "MultiPoint", coordinates: actual.waypoints },
							properties: {},
						}
					: EMPTY_MULTIPOINT,
			)
		}

		// Double-click an endpoint circle to remove that waypoint.
		// Middle waypoints re-route to merge the two adjacent segments; edge
		// waypoints simply trim the line.
		function handleDblClick(e: maplibregl.MapMouseEvent) {
			const endpointHit = map.queryRenderedFeatures(e.point, {
				layers: ["select-endpoints-node"],
			})
			if (endpointHit.length === 0) return

			const { selectedInstanceId, elements } = fabricStore.state
			if (!selectedInstanceId) return
			const el = elements.find((el) => el.id === selectedInstanceId)
			if (!el || el.waypoints.length <= 2) return

			snapshot() // ← capture before any mutation

			const idx = closestWaypointIndex(el.waypoints, [
				e.lngLat.lng,
				e.lngLat.lat,
			])
			const segs = el.segments?.length ? el.segments : [el.coordinates]
			const newWaypoints = el.waypoints.filter((_, i) => i !== idx) as [
				number,
				number,
			][]

			if (!shouldRouteAlongRoads(el.typeId)) {
				const newSegments = straightSegmentsFromWaypoints(newWaypoints)
				updateElement(el.id, {
					waypoints: newWaypoints,
					segments: newSegments,
					coordinates: flattenSegments(newSegments),
				})
				return
			}

			if (idx === 0) {
				const newSegments = segs.slice(1)
				updateElement(el.id, {
					waypoints: newWaypoints,
					segments: newSegments,
					coordinates: flattenSegments(newSegments),
				})
			} else if (idx === el.waypoints.length - 1) {
				const newSegments = segs.slice(0, -1)
				updateElement(el.id, {
					waypoints: newWaypoints,
					segments: newSegments,
					coordinates: flattenSegments(newSegments),
				})
			} else {
				routeBetween(el.waypoints[idx - 1], el.waypoints[idx + 1]).then(
					(merged) => {
						const newSegments: [number, number][][] = [
							...segs.slice(0, idx - 1),
							merged,
							...segs.slice(idx + 1),
						]
						updateElement(el.id, {
							waypoints: newWaypoints,
							segments: newSegments,
							coordinates: flattenSegments(newSegments),
						})
					},
				)
			}
		}

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key !== "Delete" && e.key !== "Backspace") return
			const active = document.activeElement
			if (
				active instanceof HTMLInputElement ||
				active instanceof HTMLTextAreaElement ||
				(active instanceof HTMLElement && active.isContentEditable)
			)
				return
			const id = fabricStore.state.selectedInstanceId
			if (!id) return
			deleteElement(id)
			setSelectedInstanceId(null)
		}

		map.doubleClickZoom.disable()
		map.on("click", handleClick)
		map.on("dblclick", handleDblClick)
		map.on("mousedown", handleMouseDown)
		map.on("mousemove", handleMapMouseMove)
		window.addEventListener("mousemove", handleWindowMouseMove)
		window.addEventListener("mouseup", handleMouseUp)
		window.addEventListener("keydown", handleKeyDown)

		return () => {
			map.doubleClickZoom.enable()
			map.off("click", handleClick)
			map.off("dblclick", handleDblClick)
			map.off("mousedown", handleMouseDown)
			map.off("mousemove", handleMapMouseMove)
			window.removeEventListener("mousemove", handleWindowMouseMove)
			window.removeEventListener("mouseup", handleMouseUp)
			window.removeEventListener("keydown", handleKeyDown)
			// Clean up any in-progress drag
			dragging.current = null
			if (routeDebounce.current) clearTimeout(routeDebounce.current)
			map.dragPan.enable()
		}
	}, [
		activeTool,
		map,
		deleteElement,
		setSelectedInstanceId,
		updateElement,
		snapshot,
		routeBetween,
	])

	return null
}
