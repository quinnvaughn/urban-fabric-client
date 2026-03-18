import { useEffect, useRef } from "react"
import {
	elementsLayerIds,
	removeElementsFromMap,
	syncElementsToMap,
} from "#/features/fabric/elements-layer/map-elements-utils"
import { useMap } from "#/features/fabric/fabric-map"
import { useProposalStore } from "../proposal-store"

export function ProposalElementsLayer() {
	const map = useMap()
	const elements = useProposalStore((s) => s.elements)
	const elementLayerIds = useRef<Set<string>>(new Set())

	useEffect(() => {
		syncElementsToMap({
			map,
			elements,
			elementLayerIds: elementLayerIds.current,
		})
	}, [elements, map])

	useEffect(() => {
		return () => {
			removeElementsFromMap(map, elementLayerIds.current)
		}
	}, [map])

	useEffect(() => {
		const handleClick = (e: maplibregl.MapMouseEvent) => {
			const layerIds = [...elementLayerIds.current].map((id) =>
				elementsLayerIds.mainLayerId(id),
			)
			const features = map.queryRenderedFeatures(e.point, { layers: layerIds })
			if (features.length === 0) return

			const elementId = features[0].layer.id.replace(/^el-/, "")
			const { setSelectedInstanceId } = useProposalStore.getState()
			setSelectedInstanceId(elementId)
		}

		const handleMouseMove = (e: maplibregl.MapMouseEvent) => {
			const layerIds = [...elementLayerIds.current].map((id) =>
				elementsLayerIds.mainLayerId(id),
			)
			const features = map.queryRenderedFeatures(e.point, { layers: layerIds })
			map.getCanvas().style.cursor = features.length > 0 ? "pointer" : ""
		}

		map.on("click", handleClick)
		map.on("mousemove", handleMouseMove)
		return () => {
			map.off("click", handleClick)
			map.off("mousemove", handleMouseMove)
			map.getCanvas().style.cursor = ""
		}
	}, [map])

	return null
}
