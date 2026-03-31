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
}

export function ShareProposalButton({ proposal }: Props) {
	return (
		<Button
			type="button"
			size={"md"}
			intent="neutral"
			appearance="outline"
			onClick={() => {
				openModal("shareProposal", {
					link: window.location.href,
					title: proposal.title,
					source: "share_button",
				})
			}}
		>
			<Share size={16} />
		</Button>
	)
}
