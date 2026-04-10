import type maplibregl from "maplibre-gl"
import type { LinePaint } from "../element-types"
import { computeBasePaint, ELEMENT_TYPE_MAP } from "../element-types"
import type { ElementDescriptor, ElementInstance, LineLayerStyle } from "../element-types/types"

function arrowImageId(color: string) {
	return `urban-fabric-arrow-${color.replace("#", "")}`
}

function ensureArrowImage(map: maplibregl.Map, color: string): string {
	const id = arrowImageId(color)
	if (map.hasImage(id)) return id
	const size = 20
	const canvas = document.createElement("canvas")
	canvas.width = size
	canvas.height = size
	const ctx = canvas.getContext("2d")
	if (!ctx) return id
	// White fill with colored outline
	ctx.lineJoin = "round"
	ctx.fillStyle = "#ffffff"
	ctx.beginPath()
	ctx.moveTo(2, 2)
	ctx.lineTo(size - 2, size / 2)
	ctx.lineTo(2, size - 2)
	ctx.closePath()
	ctx.fill()
	ctx.strokeStyle = color
	ctx.lineWidth = 2
	ctx.stroke()
	const imageData = ctx.getImageData(0, 0, size, size)
	map.addImage(id, {
		width: size,
		height: size,
		data: new Uint8Array(imageData.data.buffer),
	})
	return id
}
import {
	hasLayer,
	hasSource,
	removeLayersIfPresent,
	removeSourcesIfPresent,
} from "../fabric-map"

export const elementsLayerIds = {
	casingLayerId: (id: string) => `el-${id}-casing`,
	mainLayerId: (id: string) => `el-${id}`,
	arrowLayerId: (id: string) => `el-${id}-arrows`,
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
		elementsLayerIds.arrowLayerId(id),
	]
	const sources = [
		elementsLayerIds.casingSourceId(id),
		elementsLayerIds.mainSourceId(id),
	]
	removeLayersIfPresent(map, layers)
	removeSourcesIfPresent(map, sources)
}

function getDirection(
	descriptor: ElementDescriptor,
	el: ElementInstance,
): string | null {
	const prop = descriptor.properties.find((p) => p.key === "direction")
	if (!prop) return null
	return (el.properties.direction as string | undefined) ?? (prop.default as string)
}

function addArrowLayer(
	map: maplibregl.Map,
	el: ElementInstance,
	descriptor: ElementDescriptor,
) {
	const imageId = ensureArrowImage(map, descriptor.baseMapStyle.color)
	// No beforeId — arrow layer must render above the line layers
	map.addLayer({
		id: elementsLayerIds.arrowLayerId(el.id),
		type: "symbol",
		source: elementsLayerIds.mainSourceId(el.id),
		layout: {
			"symbol-placement": "line",
			"icon-image": imageId,
			"icon-size": 1,
			"symbol-spacing": 150,
			"icon-keep-upright": false,
			"icon-rotation-alignment": "map",
			"icon-pitch-alignment": "viewport",
		},
		paint: {
			"icon-opacity": 1,
		},
	})
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

			const direction = getDirection(descriptor, el)
			const arrowId = elementsLayerIds.arrowLayerId(el.id)
			if (direction === "one-way" && !hasLayer(map, arrowId)) {
				addArrowLayer(map, el, descriptor)
			} else if (direction !== "one-way" && hasLayer(map, arrowId)) {
				removeLayersIfPresent(map, [arrowId])
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

		if (getDirection(descriptor, el) === "one-way") {
			addArrowLayer(map, el, descriptor)
		}

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
