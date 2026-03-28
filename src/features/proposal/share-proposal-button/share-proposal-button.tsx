import { Share } from "lucide-react"
import { Button } from "#/features/ui"
import type { GetProposalQuery } from "#/graphql/generated"
import { useCurrentUser } from "#/lib/graphql"
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
	const { data: currentUser } = useCurrentUser()
	return (
		<Button
			type="button"
			size={isMobile ? "sm" : "md"}
			intent="neutral"
			appearance="outline"
			onClick={() => {
				openModal("shareProposal", {
					link: window.location.href,
					title: proposal.title,
					source: "share_button",
					isOwner: currentUser?.me?.id === proposal.creator.id,
				})
			}}
		>
			<Share size={16} />
		</Button>
	)
}
