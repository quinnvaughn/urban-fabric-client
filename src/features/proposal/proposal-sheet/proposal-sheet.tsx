import * as React from "react"
import { Box } from "#/features/ui"
import { sva } from "#/styles/styled-system/css"

const proposalSheet = sva({
	className: "proposal-sheet",
	slots: ["container", "body", "handle", "handlePill", "peek"],
	base: {
		container: {
			position: "absolute",
			bottom: 0,
			left: 0,
			right: 0,
			height: "100%",
			maxHeight: "60dvh",
			display: "flex",
			flexDirection: "column",
			bg: "white",
			boxShadow: "xl",
			zIndex: "modal",
			borderTopWidth: "1",
			borderStyle: "solid",
			borderColor: "border.subtle",
			borderTopRadius: "xl",
			transition: "transform 340ms {easings.spring}",
			"&[data-open=true]": {
				transform: "translateY(0)",
			},
			"&[data-open=false]": {
				transform: "translateY(calc(100% - 60px))",
			},
		},
		body: {
			flex: "1",
			overflowY: "auto",
		},
		handle: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			paddingTop: "2.5",
			paddingBottom: "1.5",
			cursor: "pointer",
		},
		handlePill: {
			w: "9",
			h: "1",
			bg: "stone.300",
			borderRadius: "full",
			pointerEvents: "none",
		},
		peek: {
			display: "flex",
			alignItems: "center",
			gap: "2.5",
			px: "4",
			paddingBottom: "3",
			flexShrink: 0,
			opacity: 1,
			transition: "opacity 80ms ease",
			"&[data-visible=false]": {
				opacity: 0,
				pointerEvents: "none",
			},
		},
	},
})

interface ProposalSheetProps {
	open?: boolean
	onOpenChange?: (open: boolean) => void
	peek: React.ReactNode
	children: React.ReactNode
}

export function ProposalSheet({
	open: openProp,
	onOpenChange,
	peek,
	children,
}: ProposalSheetProps) {
	const [openState, setOpenState] = React.useState(false)
	const open = openProp ?? openState

	const setOpen = React.useCallback(
		(value: boolean | ((prev: boolean) => boolean)) => {
			const next = typeof value === "function" ? value(open) : value
			setOpenState(next)
			onOpenChange?.(next)
		},
		[open, onOpenChange],
	)

	React.useEffect(() => {
		if (!open) return
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") setOpen(false)
		}
		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [open, setOpen])

	const styles = proposalSheet()

	return (
		<div
			role="dialog"
			aria-modal="true"
			data-open={open ? "true" : "false"}
			className={styles.container}
		>
			<button
				type="button"
				aria-label="Toggle sheet"
				className={styles.handle}
				onClick={() => setOpen((v) => !v)}
			>
				<div className={styles.handlePill} />
			</button>
			<Box data-visible={peek ? "true" : "false"} className={styles.peek}>
				{peek}
			</Box>
			<div className={styles.body}>{children}</div>
		</div>
	)
}
