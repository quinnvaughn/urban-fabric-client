import { useLazyQuery } from "@apollo/client/react"
import { MapPin } from "lucide-react"
import type maplibregl from "maplibre-gl"
import { useEffect, useRef } from "react"
import { useMap } from "#/features/fabric"
import { useProposalStore } from "#/features/proposal/proposal-store"
import { Box, Button, HStack, Typography } from "#/features/ui"
import { ReverseGeocodeLocationDocument } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { useCommentComposerStore } from "../comment-composer-store"
import { createProposalCommentLocationMarker } from "../proposal-comment-location-marker"

export function ProposalCommentLocationPicker() {
	const map = useMap()
	const [getLocation] = useLazyQuery(ReverseGeocodeLocationDocument)
	const markerRef = useRef<maplibregl.Marker | null>(null)
	const { setActiveCommentLocation } = useProposalStore()
	const {
		isPickingLocation,
		pendingLocation,
		setPendingLocation,
		cancelPickingLocation,
	} = useCommentComposerStore()

	useEffect(() => {
		if (isPickingLocation || pendingLocation) {
			setActiveCommentLocation(null)
		}
	}, [isPickingLocation, pendingLocation, setActiveCommentLocation])

	useEffect(() => {
		if (!pendingLocation) {
			markerRef.current?.remove()
			markerRef.current = null
			return
		}

		const marker =
			markerRef.current ??
			createProposalCommentLocationMarker({ pulse: true, scale: 1.15 })

		marker.setLngLat([pendingLocation.lng, pendingLocation.lat]).addTo(map)
		markerRef.current = marker

		return () => {
			markerRef.current?.remove()
			markerRef.current = null
		}
	}, [map, pendingLocation])

	useEffect(() => {
		if (!isPickingLocation) return

		map.getCanvas().style.cursor = "crosshair"

		const handleClick = async (e: maplibregl.MapMouseEvent) => {
			const { lat, lng } = e.lngLat
			const { data } = await getLocation({ variables: { lat, lng } })
			setPendingLocation({
				lat: e.lngLat.lat,
				lng: e.lngLat.lng,
				name: data?.reverseGeocodeLocation ?? "Selected location",
			})
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				cancelPickingLocation()
			}
		}

		map.on("click", handleClick)
		window.addEventListener("keydown", handleKeyDown)

		return () => {
			map.getCanvas().style.cursor = ""
			map.off("click", handleClick)
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [
		cancelPickingLocation,
		isPickingLocation,
		map,
		setPendingLocation,
		getLocation,
	])

	if (!isPickingLocation) return null

	return (
		<Box
			className={css({
				position: "absolute",
				top: "12px",
				left: "50%",
				transform: "translateX(-50%)",
				zIndex: "modal",
				pointerEvents: "none",
				px: "4",
				width: "full",
				display: "flex",
				justifyContent: "center",
			})}
		>
			<Box
				className={css({
					pointerEvents: "auto",
					display: "inline-flex",
					alignItems: "center",
					maxWidth: "calc(100vw - 32px)",
					borderRadius: "full",
					bg: "rgba(28, 25, 23, 0.92)",
					color: "white",
					boxShadow: "lg",
					px: "2",
					py: "2",
				})}
			>
				<HStack gap="2" wrap={false}>
					<Box
						className={css({
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
						})}
					>
						<MapPin size={14} />
					</Box>
					<Typography.Text
						size="sm"
						weight="medium"
						className={css({
							color: "white",
							whiteSpace: { base: "normal", md: "nowrap" },
						})}
					>
						Click anywhere on the map to drop a pin
					</Typography.Text>
					<Button
						size="xs"
						appearance="ghost"
						intent="neutral"
						className={css({
							flexShrink: 0,
							borderRadius: "full",
							borderWidth: "1px",
							borderColor: "rgba(255,255,255,0.16)",
							color: "white",
							background: "rgba(255,255,255,0.06)",
							_hover: {
								background: "rgba(255,255,255,0.12)",
							},
						})}
						onClick={cancelPickingLocation}
					>
						Cancel
					</Button>
				</HStack>
			</Box>
		</Box>
	)
}
