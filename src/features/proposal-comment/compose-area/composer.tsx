import { CornerDownLeft } from "lucide-react"
import { useState } from "react"
import { Box } from "#/features/ui"
import { useCurrentUser, useRequireAuth } from "#/lib/graphql"
import { sva } from "@/styles/styled-system/css"
import { useCommentComposerStore } from "../comment-composer-store"

const composer = sva({
	slots: ["root", "textarea", "footer", "replyContext", "locationChip"],
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
			gap: "2",
			px: "2.5",
			py: "2",
			borderTopWidth: "1",
			borderTopStyle: "solid",
			borderTopColor: "stone.100",
		},
		replyContext: {
			display: "flex",
			alignItems: "center",
			gap: "2",
			px: "2.5",
			py: "1.5",
			bg: "teal.50",
			borderBottomWidth: "1",
			borderBottomStyle: "solid",
			borderBottomColor: "teal.200",
			fontSize: "xs",
			color: "teal.700",
		},
		locationChip: {
			display: "inline-flex",
			alignItems: "center",
			gap: "1",
			height: "7",
			px: "2",
			border: "1px solid",
			borderColor: "stone.300",
			transition: "all 150ms",
			whiteSpace: "nowrap",
			borderRadius: "full",
			fontSize: "xs",
			fontWeight: "medium",
			color: "stone.700",
			cursor: "pointer",
			_hover: {
				background: "stone.100",
				borderColor: "stone.400",
				color: "stone.800",
			},
			"&[data-has-location=true]": {
				background: "teal.100",
				borderColor: "teal.300",
				color: "teal.700",
			},
		},
	},
})

type Props = {
	replyTo?: { name: string }
	onCancelReply?: () => void
}

export function CommentComposer({ replyTo, onCancelReply }: Props) {
	const { user } = useCurrentUser()
	const { startPickingLocation } = useCommentComposerStore()

	const isSignedIn = Boolean(user)
	const [focused, setFocused] = useState(false)
	const requireAuth = useRequireAuth(
		"Create an account or sign in to comment",
		"comment",
	)
	const slots = composer()

	function handleClick() {
		return requireAuth(() => {})
	}

	return (
		<Box
			className={slots.root}
			data-focused={focused || undefined}
			data-auth-gate={!isSignedIn || undefined}
			onClick={handleClick}
		>
			{replyTo && (
				<div className={slots.replyContext}>
					<CornerDownLeft size={11} />
					<span>Replying to {replyTo.name}</span>
					<button type="button" onClick={onCancelReply}>
						...
					</button>
				</div>
			)}
			<textarea
				className={slots.textarea}
				placeholder={
					isSignedIn
						? "Share your thoughts on this proposal..."
						: "Sign in to comment..."
				}
				readOnly={!isSignedIn}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
			/>
			<Box className={slots.footer}>
				<button
					type="button"
					className={slots.locationChip}
					data-has-location={false}
					onClick={startPickingLocation}
				>
					Add location
				</button>
			</Box>
		</Box>
	)
}
