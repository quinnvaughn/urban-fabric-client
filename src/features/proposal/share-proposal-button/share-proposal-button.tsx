import { Share } from "lucide-react"
import { Button } from "#/features/ui"
import type { GetProposalQuery } from "#/graphql/generated"
import { openModal } from "#/stores"

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

type Props = {
	proposal: Proposal
	isMobile?: boolean
}

export function ShareProposalButton({ proposal, isMobile }: Props) {
	return (
		<Button
			type="button"
			size={isMobile ? "sm" : "md"}
			intent="neutral"
			appearance="outline"
			onClick={() =>
				openModal("shareProposal", {
					link: window.location.href,
					title: proposal.title,
				})
			}
		>
			<Share size={16} />
		</Button>
	)
}
