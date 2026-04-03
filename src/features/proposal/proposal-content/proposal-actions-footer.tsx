import { Box } from "#/features/ui"
import type { GetProposalQuery } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { LikeProposalButton } from "../like-proposal-button"
import { ShareProposalButton } from "../share-proposal-button"

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

type Props = {
	proposal: Proposal
	isMobile?: boolean
}

export function ProposalActionsFooter({ proposal, isMobile }: Props) {
	return (
		<Box
			className={css({
				flexShrink: 0,
				borderTop: "1px solid",
				borderTopColor: "border.subtle",
				px: "5",
				py: "3.5",
				display: { base: "none", md: "flex" },
				gap: "2",
				alignItems: "center",
			})}
		>
			<LikeProposalButton proposal={proposal} isMobile={isMobile} />
			<ShareProposalButton proposal={proposal} />
		</Box>
	)
}
