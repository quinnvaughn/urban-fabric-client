import type { ReactNode } from "react"
import { Box } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { useProposalStore } from "../proposal-store"

export function ProposalPanelShell({
	children,
	width = "360px",
}: {
	children: ReactNode
	width?: string
}) {
	const { isPanelOpen } = useProposalStore()

	return (
		<Box
			id="panel"
			style={{ width }}
			className={css({
				position: "absolute",
				top: 0,
				left: 0,
				height: "100%",
				display: "flex",
				flexDirection: "column",
				background: "white",
				borderRight: "1px solid",
				borderRightColor: "border.subtle",
				transform: isPanelOpen ? "translateX(0)" : "translateX(-100%)",
				opacity: isPanelOpen ? 1 : 0,
				transition:
					"transform 280ms var(--easings-spring), opacity 200ms var(--easings-in-out)",
				zIndex: "floating",
			})}
		>
			{children}
		</Box>
	)
}
