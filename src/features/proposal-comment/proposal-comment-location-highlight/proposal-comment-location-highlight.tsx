import type maplibregl from "maplibre-gl"
import { useEffect, useRef } from "react"
import { useMap } from "#/features/fabric"
import { useProposalStore } from "#/features/proposal/proposal-store"
import { useCommentComposerStore } from "../comment-composer-store"
import { createProposalCommentLocationMarker } from "../proposal-comment-location-marker"

export function ProposalCommentLocationHighlight() {
	const map = useMap()
	const { activeCommentLocation } = useProposalStore()
	const { isPickingLocation, pendingLocation } = useCommentComposerStore()
	const markerRef = useRef<maplibregl.Marker | null>(null)

	useEffect(() => {
		if (!activeCommentLocation || isPickingLocation || pendingLocation) {
			markerRef.current?.remove()
			markerRef.current = null
			return
		}

		markerRef.current?.remove()
		const marker = createProposalCommentLocationMarker({ pulse: true })
		marker
			.setLngLat([activeCommentLocation.lng, activeCommentLocation.lat])
			.addTo(map)
		markerRef.current = marker

		map.flyTo({
			center: [activeCommentLocation.lng, activeCommentLocation.lat],
			duration: 700,
			essential: true,
		})

		return () => {
			marker.remove()
			if (markerRef.current === marker) markerRef.current = null
		}
	}, [activeCommentLocation, isPickingLocation, map, pendingLocation])

	return null
}
