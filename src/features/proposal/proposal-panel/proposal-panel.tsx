import { Box } from "#/features/ui"
import type { GetProposalQuery } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { ProposalContent } from "../proposal-content"
import { useProposalStore } from "../proposal-store"

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

export function ProposalPanel({ proposal }: { proposal: Proposal }) {
	const { isPanelOpen } = useProposalStore()

	return (
		<Box
			id="panel"
			className={css({
				position: "absolute",
				top: 0,
				left: 0,
				width: "360px",
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
			<ProposalContent proposal={proposal} />
		</Box>
	)
}
