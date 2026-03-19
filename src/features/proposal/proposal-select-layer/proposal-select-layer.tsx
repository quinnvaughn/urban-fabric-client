import { useEffect } from "react"
import {
	computeBasePaint,
	ELEMENT_TYPE_MAP,
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
			el && descriptor ? computeBasePaint(descriptor, el) : undefined
		const sel = s?.selected

		if (!el || !s || !sel) {
			lineSource.setData(EMPTY_LINE)
			map.setPaintProperty("proposal-select-main", "line-opacity", 0)
			map.setPaintProperty("proposal-select-outline-above", "line-opacity", 0)
			map.setPaintProperty("proposal-select-outline-below", "line-opacity", 0)
			return
		}

		const hasDashedMain = Boolean(computedPaint?.["line-dasharray"]?.length)

		map.setPaintProperty(
			"proposal-select-main",
			"line-color",
			sel.color ?? computedPaint?.["line-color"] ?? s.color,
		)
		map.setPaintProperty(
			"proposal-select-main",
			"line-width",
			sel.width ?? computedPaint?.["line-width"] ?? s.width,
		)
		map.setPaintProperty(
			"proposal-select-main",
			"line-dasharray",
			computedPaint?.["line-dasharray"] ?? null,
		)
		map.setLayoutProperty(
			"proposal-select-main",
			"line-cap",
			sel.lineCap ?? s.lineCap ?? "round",
		)

		const outlineOpacity = sel.outlineOpacity ?? 0.85
		const outlineWidth = sel.outlineWidth ?? 1.5
		const offset = sel.outlineOffset ?? 8

		map.setPaintProperty(
			"proposal-select-outline-above",
			"line-color",
			computedPaint?.["line-color"] ?? s.color,
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
			computedPaint?.["line-color"] ?? s.color,
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

		if (sel.outlineDasharray) {
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
			geometry: { type: "LineString", coordinates: el.coordinates },
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
			hasDashedMain ? 0 : 1,
		)
	}, [map, selectedInstanceId, elements])

	return null
}
