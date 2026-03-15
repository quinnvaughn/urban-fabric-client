import { useEffect, useRef } from "react"
import type { ElementInstance } from "../element-types/types"
import { hasLayer, useMap } from "../fabric-map"
import { removeElementsFromMap, syncElementsToMap } from "./map-elements-utils"

type Props = {
	elements: ElementInstance[]
	belowLayerId?: string
}

export function StaticElementsLayer({ elements, belowLayerId }: Props) {
	const map = useMap()
	const elementLayerIds = useRef<Set<string>>(new Set())

	useEffect(() => {
		syncElementsToMap({
			map,
			elements,
			elementLayerIds: elementLayerIds.current,
			belowLayerId,
		})
	}, [elements, map, belowLayerId])

	useEffect(() => {
		return () => {
			removeElementsFromMap(map, elementLayerIds.current)
		}
	}, [map])

	useEffect(() => {
		if (!belowLayerId || !hasLayer(map, belowLayerId)) return
		syncElementsToMap({
			map,
			elements,
			elementLayerIds: elementLayerIds.current,
			belowLayerId,
		})
	}, [map, belowLayerId, elements])

	return null
}
