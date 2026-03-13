import type maplibregl from "maplibre-gl"
import { useEffect, useRef } from "react"
import { ELEMENT_TYPE_MAP, computeBasePaint } from "../element-types"
import { useMap } from "../fabric-map"
import { useFabricStore } from "../fabric-store"
import { flattenSegments, routeBetween, snapToRoad } from "../osrm-utils"

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

const EMPTY_POINT: GeoJSON.Feature<GeoJSON.Point> = {
	type: "Feature",
	geometry: { type: "Point", coordinates: [] },
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

// Returns the index of the segment that contains the line's midpoint.
function segmentIndexAtMidpoint(segments: [number, number][][]): number {
	const lengths = segments.map((seg) => {
		let len = 0
		for (let i = 1; i < seg.length; i++) {
			const dx = seg[i][0] - seg[i - 1][0]
			const dy = seg[i][1] - seg[i - 1][1]
			len += Math.sqrt(dx * dx + dy * dy)
		}
		return len
	})
	const total = lengths.reduce((a, b) => a + b, 0)
	let cumulative = 0
	const half = total / 2
	for (let i = 0; i < lengths.length; i++) {
		cumulative += lengths[i]
		if (cumulative >= half) return i
	}
	return segments.length - 1
}

function lineMidpoint(coords: [number, number][]): [number, number] {
	if (coords.length === 0) return [0, 0]
	if (coords.length === 1) return coords[0]
	let total = 0
	const dists: number[] = [0]
	for (let i = 1; i < coords.length; i++) {
		const dx = coords[i][0] - coords[i - 1][0]
		const dy = coords[i][1] - coords[i - 1][1]
		total += Math.sqrt(dx * dx + dy * dy)
		dists.push(total)
	}
	const half = total / 2
	for (let i = 1; i < coords.length; i++) {
		if (dists[i] >= half) {
			const seg = dists[i] - dists[i - 1]
			const t = seg === 0 ? 0 : (half - dists[i - 1]) / seg
			return [
				coords[i - 1][0] + t * (coords[i][0] - coords[i - 1][0]),
				coords[i - 1][1] + t * (coords[i][1] - coords[i - 1][1]),
			]
		}
	}
	return coords[coords.length - 1]
}

// Generates a pill SVG and returns it as an HTMLImageElement for map.addImage.
function makeMidHandleImage(
	w: number,
	h: number,
	r: number,
	fill: string,
	stroke: string,
	strokeWidth: number,
): Promise<{ img: HTMLImageElement; pixelRatio: number }> {
	const scale = 2 // render at 2x for retina
	const pad = (strokeWidth + 2) * scale // enough room for shadow + stroke
	const svgW = (w + pad * 2) * scale
	const svgH = (h + pad * 2) * scale
	const rx = r * scale
	const sw = strokeWidth * scale

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}">
		<defs>
			<filter id="sh" x="-40%" y="-40%" width="180%" height="180%">
				<feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="rgba(0,0,0,0.18)"/>
			</filter>
		</defs>
		<rect
			x="${pad * scale}" y="${pad * scale}"
			width="${w * scale}" height="${h * scale}"
			rx="${rx}" ry="${rx}"
			fill="${fill}"
			stroke="${stroke}"
			stroke-width="${sw}"
			filter="url(#sh)"
		/>
	</svg>`

	const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
	return new Promise((resolve, reject) => {
		const img = new Image(svgW, svgH)
		img.onload = () => resolve({ img, pixelRatio: scale })
		img.onerror = reject
		img.src = url
	})
}

// Returns clockwise degrees from north, matching MapLibre's icon-rotate convention
function lineBearingAtMidpoint(coords: [number, number][]): number {
	if (coords.length < 2) return 0
	let total = 0
	const dists: number[] = [0]
	for (let i = 1; i < coords.length; i++) {
		const dx = coords[i][0] - coords[i - 1][0]
		const dy = coords[i][1] - coords[i - 1][1]
		total += Math.sqrt(dx * dx + dy * dy)
		dists.push(total)
	}
	const half = total / 2
	for (let i = 1; i < coords.length; i++) {
		if (dists[i] >= half) {
			const cosLat = Math.cos((coords[i - 1][1] * Math.PI) / 180)
			const dx = (coords[i][0] - coords[i - 1][0]) * cosLat
			const dy = coords[i][1] - coords[i - 1][1]
			return (Math.atan2(dx, dy) * 180) / Math.PI - 90
		}
	}
	return 0
}

const MID_HANDLE_IMAGE_ID = "select-mid-handle-img"

// ── Component ─────────────────────────────────────────────────────────────────

export function SelectLayer() {
	const map = useMap()
	const activeTool = useFabricStore((s) => s.activeTool)
	const elements = useFabricStore((s) => s.elements)
	const selectedInstanceId = useFabricStore((s) => s.selectedInstanceId)
	const setSelectedInstanceId = useFabricStore((s) => s.setSelectedInstanceId)
	const deleteElement = useFabricStore((s) => s.deleteElement)
	const updateElement = useFabricStore((s) => s.updateElement)

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
		map.addSource("select-midpoint", { type: "geojson", data: EMPTY_POINT })

		// Line layers first so circles and handle render on top of them

		map.addLayer({
			id: "select-outline-below",
			type: "line",
			source: "select-line",
			layout: { "line-join": "round", "line-cap": "round" },
			paint: {
				"line-color": "#000000",
				"line-opacity": 0,
				"line-width": 1.5,
				"line-offset": -9,
			},
		})
		map.addLayer({
			id: "select-outline-above",
			type: "line",
			source: "select-line",
			layout: { "line-join": "round", "line-cap": "round" },
			paint: {
				"line-color": "#000000",
				"line-opacity": 0,
				"line-width": 1.5,
				"line-offset": 9,
			},
		})
		map.addLayer({
			id: "select-main",
			type: "line",
			source: "select-line",
			layout: { "line-join": "round", "line-cap": "round" },
			paint: { "line-color": "#000000", "line-opacity": 0, "line-width": 4 },
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
			},
		})

		// Mid-handle symbol — topmost
		map.addLayer({
			id: "select-mid-handle",
			type: "symbol",
			source: "select-midpoint",
			layout: {
				"icon-image": "",
				"icon-rotate": ["get", "bearing"],
				"icon-rotation-alignment": "map",
				"icon-allow-overlap": true,
				"icon-ignore-placement": true,
			},
		})

		return () => {
			for (const id of [
				"select-mid-handle",
				"select-endpoints-node",
				"select-endpoints-glow",
				"select-endpoints-snap-ring",
				"select-drag-preview",
				"select-main",
				"select-outline-above",
				"select-outline-below",
			]) {
				if (map.getLayer(id)) map.removeLayer(id)
			}
			for (const id of [
				"select-line",
				"select-endpoints",
				"select-midpoint",
				"select-drag-preview",
			]) {
				if (map.getSource(id)) map.removeSource(id)
			}
			if (map.hasImage(MID_HANDLE_IMAGE_ID))
				map.removeImage(MID_HANDLE_IMAGE_ID)
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
		const midSource = map.getSource("select-midpoint") as
			| maplibregl.GeoJSONSource
			| undefined
		if (!lineSource || !pointSource || !midSource) return

		const el = elements.find((e) => e.id === selectedInstanceId)
		const descriptor = el ? ELEMENT_TYPE_MAP[el.typeId] : undefined
		const s = descriptor?.baseMapStyle
		const sel = s?.selected
		const ep = s?.endpoints
		const mh = s?.midHandle

		if (!el || !s || !sel) {
			lineSource.setData(EMPTY_LINE)
			pointSource.setData(EMPTY_MULTIPOINT)
			midSource.setData(EMPTY_POINT)
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
			map.setLayoutProperty("select-mid-handle", "icon-image", "")
			return
		}

		// Geometry
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
		midSource.setData({
			type: "Feature",
			geometry: { type: "Point", coordinates: lineMidpoint(el.coordinates) },
			properties: { bearing: lineBearingAtMidpoint(el.coordinates) },
		})

		// Main stroke — use the same computed paint as the base layer so property
		// overrides (dasharray, color, etc.) are reflected while selected
		const basePaint = computeBasePaint(descriptor, el)
		map.setPaintProperty("select-main", "line-color", basePaint["line-color"])
		map.setPaintProperty("select-main", "line-width", basePaint["line-width"])
		map.setPaintProperty("select-main", "line-opacity", basePaint["line-opacity"])
		map.setPaintProperty("select-main", "line-dasharray", basePaint["line-dasharray"] ?? null)
		map.setPaintProperty("select-drag-preview", "line-color", sel.color ?? s.color)
		map.setLayoutProperty(
			"select-main",
			"line-cap",
			s.lineCap ?? "round",
		)

		// Outlines
		const outlineOpacity = sel.outlineOpacity ?? 0.85
		const outlineWidth = sel.outlineWidth ?? 1.5
		const offset = sel.outlineOffset ?? 8

		map.setPaintProperty("select-outline-above", "line-color", s.color)
		map.setPaintProperty("select-outline-above", "line-opacity", outlineOpacity)
		map.setPaintProperty("select-outline-above", "line-width", outlineWidth)
		map.setPaintProperty("select-outline-above", "line-offset", offset)
		map.setPaintProperty("select-outline-below", "line-color", s.color)
		map.setPaintProperty("select-outline-below", "line-opacity", outlineOpacity)
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
				s.color,
			)
			map.setPaintProperty(
				"select-endpoints-node",
				"circle-stroke-width",
				ep.strokeWidth,
			)
			map.setPaintProperty("select-endpoints-node", "circle-opacity", 1)
			map.setPaintProperty("select-endpoints-node", "circle-stroke-opacity", 1)
			map.setPaintProperty(
				"select-endpoints-glow",
				"circle-radius",
				ep.glowRadius,
			)
			map.setPaintProperty("select-endpoints-glow", "circle-color", s.color)
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
				s.color,
			)
			map.setPaintProperty(
				"select-endpoints-snap-ring",
				"circle-stroke-width",
				ep.snapRingWidth,
			)
			map.setPaintProperty(
				"select-endpoints-snap-ring",
				"circle-stroke-opacity",
				ep.snapRingOpacity,
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

		// Mid-handle — build SVG image from spec, register with map, show symbol
		if (mh) {
			makeMidHandleImage(
				mh.width,
				mh.height,
				mh.radius,
				mh.fillColor,
				s.color,
				mh.strokeWidth,
			).then(({ img, pixelRatio }) => {
				if (map.hasImage(MID_HANDLE_IMAGE_ID))
					map.removeImage(MID_HANDLE_IMAGE_ID)
				map.addImage(MID_HANDLE_IMAGE_ID, img, { pixelRatio })
				map.setLayoutProperty(
					"select-mid-handle",
					"icon-image",
					MID_HANDLE_IMAGE_ID,
				)
			})
		} else {
			map.setLayoutProperty("select-mid-handle", "icon-image", "")
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

		function handleClick(e: maplibregl.MapMouseEvent) {
			// Suppress click that ends a drag
			if (hasDragged.current) {
				hasDragged.current = false
				return
			}
			// Don't deselect when clicking on a handle
			const handleHit = map.queryRenderedFeatures(e.point, {
				layers: ["select-endpoints-node", "select-mid-handle"],
			})
			if (handleHit.length > 0) return

			const layers = elementLayerIds()
			if (layers.length === 0) {
				setSelectedInstanceId(null)
				return
			}
			const features = map.queryRenderedFeatures(e.point, { layers })
			if (features.length === 0) {
				setSelectedInstanceId(null)
				return
			}
			const instanceId = features[0].layer.id.replace(/^el-/, "")
			setSelectedInstanceId(instanceId)
		}

		function handleMouseDown(e: maplibregl.MapMouseEvent) {
			const { selectedInstanceId, elements } = useFabricStore.getState()
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

			// ── Mid-handle pull ──────────────────────────────────────────────
			const midHit = map.queryRenderedFeatures(e.point, {
				layers: ["select-mid-handle"],
			})
			if (midHit.length > 0 && el.waypoints.length >= 2) {
				map.dragPan.disable()
				map.getCanvas().style.cursor = "grabbing"
				// Mark as not-ready while async routing initialises
				dragging.current = { waypointIndex: -1, elementId: el.id, ready: false }

				const segments = el.segments?.length ? el.segments : [el.coordinates]
				const segIdx = segmentIndexAtMidpoint(segments)
				const mid = lineMidpoint(el.coordinates)

				snapToRoad(mid[0], mid[1])
					.then((snapped) =>
						Promise.all([
							routeBetween(el.waypoints[segIdx], snapped),
							routeBetween(snapped, el.waypoints[segIdx + 1]),
						]).then(([leftSeg, rightSeg]) => {
							// User may have released before routing finished
							if (dragging.current?.elementId !== el.id) return
							const newWaypoints: [number, number][] = [
								...el.waypoints.slice(0, segIdx + 1),
								snapped,
								...el.waypoints.slice(segIdx + 1),
							]
							const newSegments: [number, number][][] = [
								...segments.slice(0, segIdx),
								leftSeg,
								rightSeg,
								...segments.slice(segIdx + 1),
							]
							updateElement(el.id, {
								waypoints: newWaypoints,
								segments: newSegments,
								coordinates: flattenSegments(newSegments),
							})
							dragging.current = {
								waypointIndex: segIdx + 1,
								elementId: el.id,
								ready: true,
							}
						}),
					)
					.catch(() => {
						dragging.current = null
						map.dragPan.enable()
						map.getCanvas().style.cursor = ""
					})
			}
		}

		// Map-level mousemove: cursor hover feedback only (not used during drag)
		function handleMapMouseMove(e: maplibregl.MapMouseEvent) {
			if (dragging.current) return
			const endpointHit = map.queryRenderedFeatures(e.point, {
				layers: ["select-endpoints-node"],
			})
			const midHit = map.queryRenderedFeatures(e.point, {
				layers: ["select-mid-handle"],
			})
			map.getCanvas().style.cursor =
				endpointHit.length > 0 || midHit.length > 0 ? "grab" : ""
		}

		// Window-level mousemove: drag tracking. Uses map.unproject so events are
		// received even when MapLibre's gesture system swallows map-level events.
		function handleWindowMouseMove(e: MouseEvent) {
			if (!dragging.current?.ready) return

			const { selectedInstanceId, elements } = useFabricStore.getState()
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

			const previewSrc = map.getSource(
				"select-drag-preview",
			) as maplibregl.GeoJSONSource | undefined
			previewSrc?.setData({
				type: "Feature",
				geometry: { type: "LineString", coordinates: previewCoords },
				properties: {},
			})

			const endpointSrc = map.getSource(
				"select-endpoints",
			) as maplibregl.GeoJSONSource | undefined
			const previewWaypoints = [...waypoints]
			previewWaypoints[waypointIndex] = cursorPos
			endpointSrc?.setData({
				type: "Feature",
				geometry: { type: "MultiPoint", coordinates: previewWaypoints },
				properties: {},
			})

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
				const { selectedInstanceId: sid, elements: els } =
					useFabricStore.getState()
				if (!sid) return
				const fresh = els.find((el) => el.id === sid)
				if (!fresh) return

				const freshWaypoints = [...fresh.waypoints] as [number, number][]
				const freshSegments = [
					...(fresh.segments?.length ? fresh.segments : [fresh.coordinates]),
				] as [number, number][][]

				try {
					const snapped = await snapToRoad(
						capturedCursor[0],
						capturedCursor[1],
					)
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
			dragging.current = null
			if (routeDebounce.current) {
				clearTimeout(routeDebounce.current)
				routeDebounce.current = null
			}
			map.dragPan.enable()
			map.getCanvas().style.cursor = ""
			// Clear preview in case OSRM hadn't resolved yet when mouse was released
			;(
				map.getSource("select-drag-preview") as
					| maplibregl.GeoJSONSource
					| undefined
			)?.setData(EMPTY_LINE)
		}

		// Double-click an endpoint circle to remove that waypoint.
		// Middle waypoints re-route to merge the two adjacent segments; edge
		// waypoints simply trim the line.
		function handleDblClick(e: maplibregl.MapMouseEvent) {
			const endpointHit = map.queryRenderedFeatures(e.point, {
				layers: ["select-endpoints-node"],
			})
			if (endpointHit.length === 0) return

			const { selectedInstanceId, elements } = useFabricStore.getState()
			if (!selectedInstanceId) return
			const el = elements.find((el) => el.id === selectedInstanceId)
			if (!el || el.waypoints.length <= 2) return

			const idx = closestWaypointIndex(el.waypoints, [
				e.lngLat.lng,
				e.lngLat.lat,
			])
			const segs = el.segments?.length ? el.segments : [el.coordinates]
			const newWaypoints = el.waypoints.filter(
				(_, i) => i !== idx,
			) as [number, number][]

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
				// Re-route to bridge the gap left by the removed waypoint
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
			const id = useFabricStore.getState().selectedInstanceId
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
	}, [activeTool, map, deleteElement, setSelectedInstanceId, updateElement])

	return null
}
