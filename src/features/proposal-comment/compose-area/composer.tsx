import { MapPin, X } from "lucide-react"
import { type MouseEvent, useState } from "react"
import { Box, Button } from "#/features/ui"
import { useCurrentUser, useRequireAuth } from "#/lib/graphql"
import { sva } from "@/styles/styled-system/css"
import { useCommentComposerStore } from "../comment-composer-store"

const composer = sva({
	slots: [
		"root",
		"textarea",
		"footer",
		"locationGroup",
		"locationChip",
		"clearLocationButton",
	],
	base: {
		root: {
			borderRadius: "lg",
			borderWidth: "1",
			borderStyle: "solid",
			borderColor: "border.default",
			bg: "white",
			transition:
				"border-color 160ms {easings.inOut}, box-shadow 160ms {easings.inOut}",
			"&[data-focused]": {
				borderColor: "teal.500",
				boxShadow: "0 0 0 3px token(colors.teal.100)",
			},
			"&[data-auth-gate]": {
				cursor: "pointer",
				_hover: { borderColor: "border.strong" },
			},
		},
		textarea: {
			width: "full",
			minHeight: "16",
			maxHeight: "40",
			border: "none",
			outline: "none",
			background: "transparent",
			resize: "none",
			font: "sans",
			fontSize: "md",
			lineHeight: "relaxed",
			color: "fg.default",
			py: "2.5",
			px: "3",
			_placeholder: { color: "stone.400" },
		},
		footer: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			width: "full",
			gap: "2",
			px: "2.5",
			py: "2",
			borderTopWidth: "1",
			borderTopStyle: "solid",
			borderTopColor: "stone.100",
		},
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

export function CommentComposer() {
	const { user } = useCurrentUser()
	const { startPickingLocation, pendingLocation, clearPendingLocation } =
		useCommentComposerStore()

	const isSignedIn = Boolean(user)
	const [focused, setFocused] = useState(false)
	const [text, setText] = useState("")
	const requireAuth = useRequireAuth(
		"Create an account or sign in to comment",
		"comment",
	)
	const slots = composer()

	function handleClick() {
		return requireAuth(() => {})
	}

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

	return (
		<Box
			className={slots.root}
			data-focused={focused || undefined}
			data-auth-gate={!isSignedIn || undefined}
			onClick={handleClick}
		>
			<textarea
				className={slots.textarea}
				placeholder={
					isSignedIn
						? "Share your thoughts on this proposal..."
						: "Sign in to comment..."
				}
				readOnly={!isSignedIn}
				value={text}
				onChange={(e) => setText(e.target.value)}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
			/>
			<Box className={slots.footer}>
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
						{pendingLocation ? "Location attached" : "Add location"}
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
				<Button type="submit" size="xs" disabled={!text.trim()}>
					Post
				</Button>
			</Box>
		</Box>
	)
}
