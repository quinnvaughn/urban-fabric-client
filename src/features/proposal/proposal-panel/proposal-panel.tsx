import type { GetProposalQuery } from "#/graphql/generated"
import { ProposalContent } from "../proposal-content"
import { ProposalPanelShell } from "./proposal-panel-shell"

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

export function ProposalPanel({ proposal }: { proposal: Proposal }) {
	return (
		<ProposalPanelShell>
			<ProposalContent proposal={proposal} />
		</ProposalPanelShell>
	)
}
