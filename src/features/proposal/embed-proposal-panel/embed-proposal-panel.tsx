import { Fragment } from "react/jsx-runtime"
import { Box, VStack } from "#/features/ui"
import type { GetProposalQuery } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import {
	ProposalAboutTab,
	ProposalPanelHeader,
	ProposalPanelTabs,
} from "../proposal-content"
import { ProposalPanelShell } from "../proposal-panel"
import { ProposalPanelTab, useProposalStore } from "../proposal-store"
import { EmbedCommentsPanel } from "./embed-comments-panel"
import { EmbedProposalFooter } from "./embed-proposal-footer"

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

const EMBED_PANEL_WIDTH = "min(280px, calc(100% - 48px))"

export function EmbedProposalPanel({ proposal }: { proposal: Proposal }) {
	const { activeTab, elements, setActiveTab, togglePanel } = useProposalStore()

	return (
		<ProposalPanelShell width={EMBED_PANEL_WIDTH}>
			<VStack gap="3">
				<ProposalPanelHeader
					clamp
					title={proposal.title}
					onClose={togglePanel}
				/>
				<Box className={css({ px: "5" })}>
					<VStack gap="3">
						<ProposalPanelTabs
							activeTab={activeTab}
							onValueChange={setActiveTab}
							commentCount={proposal.commentCount}
						/>
					</VStack>
				</Box>
			</VStack>
			{activeTab === ProposalPanelTab.About ? (
				<Fragment>
					<ProposalAboutTab
						description={proposal.description}
						elements={elements}
					/>
					<EmbedProposalFooter proposal={proposal} />
				</Fragment>
			) : (
				<Fragment>
					<EmbedCommentsPanel
						slug={proposal.slug}
						commentCount={proposal.commentCount}
					/>
					<EmbedProposalFooter proposal={proposal} />
				</Fragment>
			)}
		</ProposalPanelShell>
	)
}
