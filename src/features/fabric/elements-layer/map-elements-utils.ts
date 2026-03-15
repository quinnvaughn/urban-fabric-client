import type maplibregl from "maplibre-gl"
import type { LinePaint } from "../element-types"
import { computeBasePaint, ELEMENT_TYPE_MAP } from "../element-types"
import type { ElementInstance, LineLayerStyle } from "../element-types/types"
import {
	hasLayer,
	hasSource,
	removeLayersIfPresent,
	removeSourcesIfPresent,
} from "../fabric-map"

export const elementsLayerIds = {
	casingLayerId: (id: string) => `el-${id}-casing`,
	mainLayerId: (id: string) => `el-${id}`,
	casingSourceId: (id: string) => `el-${id}-casing`,
	mainSourceId: (id: string) => `el-${id}`,
}

function toMaplibrePaint(
	paint: LinePaint,
): Omit<LinePaint, "line-casing-opacity"> {
	const { "line-casing-opacity": _, ...rest } = paint
	return rest
}

function computeCasingPaint(s: LineLayerStyle): LinePaint | null {
	if (!s.casingWidth) return null
	return {
		"line-color": s.color,
		"line-width": s.casingWidth,
		"line-opacity": s.casingOpacity ?? 0.15,
	}
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

function removeElementLayers(map: maplibregl.Map, id: string) {
	const layers = [
		elementsLayerIds.casingLayerId(id),
		elementsLayerIds.mainLayerId(id),
	]
	const sources = [
		elementsLayerIds.casingSourceId(id),
		elementsLayerIds.mainSourceId(id),
	]
	removeLayersIfPresent(map, layers)
	removeSourcesIfPresent(map, sources)
}

export function syncElementsToMap(params: {
	map: maplibregl.Map
	elements: ElementInstance[]
	elementLayerIds: Set<string>
	belowLayerId?: string
}) {
	const { map, elements, elementLayerIds, belowLayerId } = params
	const currentIds = new Set(elements.map((e) => e.id))

	for (const id of elementLayerIds) {
		if (!currentIds.has(id)) {
			removeElementLayers(map, id)
			elementLayerIds.delete(id)
		}
	}

	for (const el of elements) {
		const descriptor = ELEMENT_TYPE_MAP[el.typeId]
		if (!descriptor) continue

		const data = makeLineFeature(el.coordinates)

		if (hasSource(map, elementsLayerIds.mainSourceId(el.id))) {
			;(
				map.getSource(
					elementsLayerIds.mainSourceId(el.id),
				) as maplibregl.GeoJSONSource
			).setData(data)
			if (hasSource(map, elementsLayerIds.casingSourceId(el.id))) {
				;(
					map.getSource(
						elementsLayerIds.casingSourceId(el.id),
					) as maplibregl.GeoJSONSource
				).setData(data)
			}

			if (hasLayer(map, elementsLayerIds.mainLayerId(el.id))) {
				const paint = toMaplibrePaint(computeBasePaint(descriptor, el))
				map.setPaintProperty(
					elementsLayerIds.mainLayerId(el.id),
					"line-color",
					paint["line-color"],
				)
				map.setPaintProperty(
					elementsLayerIds.mainLayerId(el.id),
					"line-width",
					paint["line-width"],
				)
				map.setPaintProperty(
					elementsLayerIds.mainLayerId(el.id),
					"line-opacity",
					paint["line-opacity"],
				)
				map.setPaintProperty(
					elementsLayerIds.mainLayerId(el.id),
					"line-dasharray",
					paint["line-dasharray"] ?? null,
				)
			}

			if (hasLayer(map, elementsLayerIds.casingLayerId(el.id))) {
				const paint = computeBasePaint(descriptor, el)
				map.setPaintProperty(
					elementsLayerIds.casingLayerId(el.id),
					"line-opacity",
					paint["line-casing-opacity"] ??
						descriptor.baseMapStyle.casingOpacity ??
						0.15,
				)
			}

			continue
		}

		const casingPaint = computeCasingPaint(descriptor.baseMapStyle)
		if (casingPaint) {
			map.addSource(elementsLayerIds.casingSourceId(el.id), {
				type: "geojson",
				data,
			})
			map.addLayer(
				{
					id: elementsLayerIds.casingLayerId(el.id),
					type: "line",
					source: elementsLayerIds.casingSourceId(el.id),
					layout: { "line-join": "round", "line-cap": "round" },
					paint: casingPaint,
				},
				belowLayerId,
			)
		}

		map.addSource(elementsLayerIds.mainSourceId(el.id), {
			type: "geojson",
			data,
		})
		map.addLayer(
			{
				id: elementsLayerIds.mainLayerId(el.id),
				type: "line",
				source: elementsLayerIds.mainSourceId(el.id),
				layout: {
					"line-join": descriptor.baseMapStyle.lineJoin ?? "round",
					"line-cap": descriptor.baseMapStyle.lineCap ?? "square",
				},
				paint: toMaplibrePaint(computeBasePaint(descriptor, el)),
			},
			belowLayerId,
		)

		elementLayerIds.add(el.id)
	}

	map.triggerRepaint()
}

export function removeElementsFromMap(
	map: maplibregl.Map,
	elementLayerIds: Set<string>,
) {
	for (const id of elementLayerIds) {
		removeElementLayers(map, id)
	}
	elementLayerIds.clear()
}
