import type maplibregl from "maplibre-gl"
import { useEffect } from "react"
import { useMap } from "../fabric-map"

const LAYER_ID = "urban-fabric-buildings-3d"
const PITCH_3D = 58

function findBuildingSourceId(map: maplibregl.Map) {
	const buildingLayer = map
		.getStyle()
		.layers?.find(
			(layer) =>
				layer.type === "fill" &&
				"source" in layer &&
				"source-layer" in layer &&
				layer["source-layer"] === "building",
		)

	return buildingLayer && "source" in buildingLayer
		? String(buildingLayer.source)
		: null
}

function firstSymbolLayerId(map: maplibregl.Map) {
	return map.getStyle().layers?.find((layer) => layer.type === "symbol")?.id
}

type Props = {
	enabled: boolean
}

export function Buildings3DLayer({ enabled }: Props) {
	const map = useMap()

	useEffect(() => {
		const existingPitch = map.getPitch()

		function removeLayer() {
			if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID)
		}

		function addLayer() {
			const buildingSourceId = findBuildingSourceId(map)
			if (!buildingSourceId) {
				console.warn(
					"[Buildings3D] No building source layer found in map style.",
				)
				return
			}

			if (map.getLayer(LAYER_ID)) return

			map.addLayer(
				{
					id: LAYER_ID,
					type: "fill-extrusion",
					source: buildingSourceId,
					"source-layer": "building",
					minzoom: 14,
					filter: ["!=", ["get", "hide_3d"], true],
					paint: {
						"fill-extrusion-base": [
							"coalesce",
							["get", "render_min_height"],
							0,
						],
						"fill-extrusion-color": ["coalesce", ["get", "colour"], "#b8b3aa"],
						"fill-extrusion-height": [
							"interpolate",
							["linear"],
							["zoom"],
							14,
							0,
							15,
							["coalesce", ["get", "render_height"], 10],
						],
						"fill-extrusion-opacity": 0.62,
						"fill-extrusion-vertical-gradient": true,
					},
				},
				firstSymbolLayerId(map),
			)
		}

		if (!enabled) {
			removeLayer()
			map.easeTo({ pitch: 0, duration: 500 })
			return
		}

		addLayer()
		map.on("styledata", addLayer)
		map.easeTo({
			pitch: Math.max(existingPitch, PITCH_3D),
			duration: 500,
		})

		return () => {
			map.off("styledata", addLayer)
			removeLayer()
			map.easeTo({ pitch: 0, duration: 500 })
		}
	}, [enabled, map])

	return null
}
