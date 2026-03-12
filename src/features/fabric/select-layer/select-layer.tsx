import type maplibregl from "maplibre-gl"
import { useEffect } from "react"
import { ELEMENT_TYPE_MAP } from "../element-types"
import { useMap } from "../fabric-map"
import { useFabricStore } from "../fabric-store"

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
				"select-main",
				"select-outline-above",
				"select-outline-below",
			]) {
				if (map.getLayer(id)) map.removeLayer(id)
			}
			for (const id of ["select-line", "select-endpoints", "select-midpoint"]) {
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

		// Main stroke
		map.setPaintProperty("select-main", "line-color", sel.color ?? s.color)
		map.setPaintProperty("select-main", "line-width", sel.width ?? s.width)
		map.setPaintProperty("select-main", "line-opacity", s.opacity ?? 1)
		map.setLayoutProperty(
			"select-main",
			"line-cap",
			sel.lineCap ?? s.lineCap ?? "round",
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

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key !== "Delete" && e.key !== "Backspace") return
			const id = useFabricStore.getState().selectedInstanceId
			if (!id) return
			deleteElement(id)
			setSelectedInstanceId(null)
		}

		map.on("click", handleClick)
		window.addEventListener("keydown", handleKeyDown)

		return () => {
			map.off("click", handleClick)
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [activeTool, map, deleteElement, setSelectedInstanceId])

	return null
}
