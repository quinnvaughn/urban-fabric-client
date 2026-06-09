import { useEffect } from "react"
import {
	computeBaseFillPaint,
	computeBasePaint,
	ELEMENT_TYPE_MAP,
	isAreaStyle,
	isLineStyle,
} from "#/features/fabric/element-types"
import {
	removeLayersIfPresent,
	removeSourcesIfPresent,
	useMap,
} from "#/features/fabric/fabric-map"
import { useProposalStore } from "../proposal-store"

const EMPTY_LINE: GeoJSON.Feature<GeoJSON.LineString> = {
	type: "Feature",
	geometry: { type: "LineString", coordinates: [] },
	properties: {},
}

const LAYER_IDS = [
	"proposal-select-outline-below",
	"proposal-select-outline-above",
	"proposal-select-main",
] as const

const SOURCE_IDS = ["proposal-select-line"] as const

export function ProposalSelectLayer() {
	const map = useMap()
	const { elements, selectedInstanceId } = useProposalStore()

	// ── Sources and layers ────────────────────────────────────────────────────
	useEffect(() => {
		map.addSource("proposal-select-line", { type: "geojson", data: EMPTY_LINE })

		map.addLayer({
			id: "proposal-select-outline-below",
			type: "line",
			source: "proposal-select-line",
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
			id: "proposal-select-outline-above",
			type: "line",
			source: "proposal-select-line",
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
			id: "proposal-select-main",
			type: "line",
			source: "proposal-select-line",
			layout: { "line-join": "round", "line-cap": "round" },
			paint: {
				"line-color": "#000000",
				"line-opacity": 0,
				"line-width": 4,
				"line-color-transition": { duration: 0, delay: 0 },
				"line-opacity-transition": { duration: 0, delay: 0 },
			},
		})

		return () => {
			removeLayersIfPresent(map, LAYER_IDS)
			removeSourcesIfPresent(map, SOURCE_IDS)
		}
	}, [map])

	// ── Sync selection visuals ────────────────────────────────────────────────
	useEffect(() => {
		const lineSource = map.getSource("proposal-select-line") as
			| maplibregl.GeoJSONSource
			| undefined
		if (!lineSource) return

		const el = elements.find((e) => e.id === selectedInstanceId)
		const descriptor = el ? ELEMENT_TYPE_MAP[el.typeId] : undefined
		const s = descriptor?.baseMapStyle
		const computedPaint =
			el && descriptor && isLineStyle(descriptor.baseMapStyle)
				? computeBasePaint(descriptor, el)
				: undefined
		const computedFillPaint =
			el && descriptor && isAreaStyle(descriptor.baseMapStyle)
				? computeBaseFillPaint(descriptor, el)
				: undefined
			const sel = s && (isLineStyle(s) || isAreaStyle(s)) ? s.selected : undefined

		if (!el || !s || !sel) {
			lineSource.setData(EMPTY_LINE)
			map.setPaintProperty("proposal-select-main", "line-opacity", 0)
			map.setPaintProperty("proposal-select-outline-above", "line-opacity", 0)
			map.setPaintProperty("proposal-select-outline-below", "line-opacity", 0)
			return
		}

		const hasDashedMain = Boolean(computedPaint?.["line-dasharray"]?.length)
		const selectionColor =
			sel.color ??
			computedPaint?.["line-color"] ??
			computedFillPaint?.["line-color"] ??
			s.color

		map.setPaintProperty("proposal-select-main", "line-color", selectionColor)
		map.setPaintProperty(
			"proposal-select-main",
			"line-width",
			("width" in sel ? sel.width : undefined) ??
				computedPaint?.["line-width"] ??
				computedFillPaint?.["line-width"] ??
				("width" in s ? s.width : undefined) ??
				3,
		)
		map.setPaintProperty(
			"proposal-select-main",
			"line-dasharray",
			computedPaint?.["line-dasharray"] ?? null,
		)
		map.setLayoutProperty(
			"proposal-select-main",
			"line-cap",
			("lineCap" in sel ? sel.lineCap : undefined) ??
				("lineCap" in s ? s.lineCap : undefined) ??
				"round",
		)

		const outlineOpacity =
			("outlineOpacity" in sel ? sel.outlineOpacity : undefined) ?? 0.85
		const outlineWidth =
			("outlineWidth" in sel ? sel.outlineWidth : undefined) ?? 1.5
		const offset = "outlineOffset" in sel ? (sel.outlineOffset ?? 8) : 0

		map.setPaintProperty(
			"proposal-select-outline-above",
			"line-color",
			computedPaint?.["line-color"] ??
				computedFillPaint?.["line-color"] ??
				("outlineColor" in sel ? sel.outlineColor : undefined) ??
				s.color,
		)
		map.setPaintProperty(
			"proposal-select-outline-above",
			"line-width",
			outlineWidth,
		)
		map.setPaintProperty("proposal-select-outline-above", "line-offset", offset)
		map.setPaintProperty(
			"proposal-select-outline-below",
			"line-color",
			computedPaint?.["line-color"] ??
				computedFillPaint?.["line-color"] ??
				("outlineColor" in sel ? sel.outlineColor : undefined) ??
				s.color,
		)
		map.setPaintProperty(
			"proposal-select-outline-below",
			"line-width",
			outlineWidth,
		)
		map.setPaintProperty(
			"proposal-select-outline-below",
			"line-offset",
			-offset,
		)

		if ("outlineDasharray" in sel && sel.outlineDasharray) {
			map.setPaintProperty(
				"proposal-select-outline-above",
				"line-dasharray",
				sel.outlineDasharray,
			)
			map.setPaintProperty(
				"proposal-select-outline-below",
				"line-dasharray",
				sel.outlineDasharray,
			)
		} else {
			map.setPaintProperty(
				"proposal-select-outline-above",
				"line-dasharray",
				null,
			)
			map.setPaintProperty(
				"proposal-select-outline-below",
				"line-dasharray",
				null,
			)
		}

		lineSource.setData({
			type: "Feature",
			geometry:
				el.geometry === "area"
					? { type: "Polygon", coordinates: [el.coordinates] }
					: { type: "LineString", coordinates: el.coordinates },
			properties: {},
		})

		map.setPaintProperty(
			"proposal-select-outline-above",
			"line-opacity",
			outlineOpacity,
		)
		map.setPaintProperty(
			"proposal-select-outline-below",
			"line-opacity",
			outlineOpacity,
		)
		map.setPaintProperty(
			"proposal-select-main",
			"line-opacity",
			el.geometry === "area" ? 0 : hasDashedMain ? 0 : 1,
		)
	}, [map, selectedInstanceId, elements])

	return null
}
