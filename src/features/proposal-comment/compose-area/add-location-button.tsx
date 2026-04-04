import { MapPin, X } from "lucide-react"
import type { MouseEvent } from "react"
import { sva } from "#/styles/styled-system/css"
import { useCommentComposerStore } from "../comment-composer-store"

type Props = {
	requireAuth: (action: () => void) => void
}

const composer = sva({
	slots: ["locationChip", "locationGroup", "clearLocationButton"],
	base: {
		locationGroup: {
			display: "inline-flex",
			alignItems: "center",
			borderRadius: "full",
			border: "1px solid",
			borderColor: "stone.300",
			background: "white",
			paddingLeft: "2",
			paddingRight: "1",
			height: "7",
			transition: "all 150ms",
			"&:not([data-has-location=true]):hover": {
				background: "stone.100",
				borderColor: "stone.400",
			},
			"&[data-has-location=true]": {
				background: "teal.100",
				borderColor: "teal.300",
			},
		},
		locationChip: {
			display: "inline-flex",
			alignItems: "center",
			gap: "1",
			height: "full",
			paddingRight: "1",
			border: "none",
			transition: "all 150ms",
			whiteSpace: "nowrap",
			background: "transparent",
			fontSize: "xs",
			fontWeight: "medium",
			color: "stone.700",
			cursor: "pointer",
			outline: "none",
			"&:not([data-has-location=true]):hover": {
				color: "stone.800",
			},
			"&[data-has-location=true]": {
				color: "teal.700",
			},
		},
		clearLocationButton: {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			width: "5",
			height: "5",
			border: "none",
			borderRadius: "full",
			color: "stone.700",
			cursor: "pointer",
			background: "rgba(255,255,255,0.45)",
			transition: "all 150ms",
			"&:not([data-has-location=true]):hover": {
				background: "rgba(255,255,255,0.7)",
				color: "stone.800",
			},
			"&[data-has-location=true]": {
				background: "teal.200",
				color: "teal.700",
			},
		},
	},
})

export function AddLocationButton({ requireAuth }: Props) {
	const { startPickingLocation, pendingLocation, clearPendingLocation } =
		useCommentComposerStore()
	function handleStartPickingLocation(e: MouseEvent<HTMLButtonElement>) {
		e.stopPropagation()
		requireAuth(() => {
			startPickingLocation()
		})
	}

	function handleClearLocation(e: MouseEvent<HTMLButtonElement>) {
		e.stopPropagation()
		clearPendingLocation()
	}

	const slots = composer()
	return (
		<div
			className={slots.locationGroup}
			data-has-location={Boolean(pendingLocation)}
		>
			<button
				type="button"
				className={slots.locationChip}
				data-has-location={Boolean(pendingLocation)}
				onClick={handleStartPickingLocation}
			>
				{pendingLocation ? (
					<MapPin size={11} color="var(--colors-teal-600)" />
				) : null}
				{pendingLocation ? pendingLocation.name : "Add location"}
			</button>
			{pendingLocation && (
				<button
					type="button"
					className={slots.clearLocationButton}
					data-has-location="true"
					aria-label="Clear selected location"
					onClick={handleClearLocation}
				>
					<X size={11} />
				</button>
			)}
		</div>
	)
}
