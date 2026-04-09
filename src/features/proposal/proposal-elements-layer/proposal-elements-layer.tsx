import { useEffect, useRef } from "react"
import {
	elementsLayerIds,
	removeElementsFromMap,
	syncElementsToMap,
} from "#/features/fabric/elements-layer/map-elements-utils"
import { useMap } from "#/features/fabric/fabric-map"
import { useCommentComposerStore } from "#/features/proposal-comment"
import { useProposalStore } from "../proposal-store"

export function ProposalElementsLayer() {
	const map = useMap()
	const { visibleElements, selectedInstance, setSelectedInstanceId } =
		useProposalStore()
	const { isPickingLocation } = useCommentComposerStore()
	const elementLayerIds = useRef<Set<string>>(new Set())

	useEffect(() => {
		syncElementsToMap({
			map,
			elements: visibleElements,
			elementLayerIds: elementLayerIds.current,
		})
	}, [visibleElements, map])

	useEffect(() => {
		if (
			selectedInstance &&
			!visibleElements.some((el) => el.id === selectedInstance.id)
		) {
			setSelectedInstanceId("")
		}
	}, [selectedInstance, setSelectedInstanceId, visibleElements])

	useEffect(() => {
		return () => {
			removeElementsFromMap(map, elementLayerIds.current)
		}
	}, [map])

	// biome-ignore lint/correctness/useExhaustiveDependencies: stable
	useEffect(() => {
		const handleClick = (e: maplibregl.MapMouseEvent) => {
			if (isPickingLocation) return

			const layerIds = [...elementLayerIds.current].map((id) =>
				elementsLayerIds.mainLayerId(id),
			)
			if (layerIds.length === 0) return
			const isTouch = e.originalEvent instanceof TouchEvent
			const r = isTouch ? 20 : 4
			const bbox: [maplibregl.PointLike, maplibregl.PointLike] = [
				[e.point.x - r, e.point.y - r],
				[e.point.x + r, e.point.y + r],
			]
			const features = map.queryRenderedFeatures(bbox, { layers: layerIds })
			if (features.length === 0) return

			const elementId = features[0].layer.id.replace(/^el-/, "")
			setSelectedInstanceId(elementId)
		}

		const handleMouseMove = (e: maplibregl.MapMouseEvent) => {
			if (isPickingLocation) {
				map.getCanvas().style.cursor = "crosshair"
				return
			}

			const layerIds = [...elementLayerIds.current].map((id) =>
				elementsLayerIds.mainLayerId(id),
			)
			if (layerIds.length === 0) {
				map.getCanvas().style.cursor = ""
				return
			}
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
	}, [isPickingLocation, map])

	return null
}
