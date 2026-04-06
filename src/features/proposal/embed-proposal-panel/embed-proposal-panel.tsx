import { DateTime } from "luxon"
import { Fragment } from "react/jsx-runtime"
import { Box, VStack } from "#/features/ui"
import type { GetProposalQuery } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import {
	ProposalAboutTab,
	ProposalPanelAuthor,
	ProposalPanelCategories,
	ProposalPanelHeader,
	ProposalPanelMeta,
	ProposalPanelTabs,
} from "../proposal-content"
import { ProposalPanelShell } from "../proposal-panel"
import { useProposalStore } from "../proposal-store"
import { EmbedCommentsPanel } from "./embed-comments-panel"
import { EmbedProposalFooter } from "./embed-proposal-footer"

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

const EMBED_PANEL_WIDTH = "280px"

export function EmbedProposalPanel({ proposal }: { proposal: Proposal }) {
	const { activeTab, elements, setActiveTab, togglePanel } = useProposalStore()
	const locationLabel = `${proposal.snapshotLocationCity}, ${proposal.snapshotLocationRegionAbbr ?? proposal.snapshotLocationRegion}`

	return (
		<ProposalPanelShell width={EMBED_PANEL_WIDTH}>
			<VStack gap="3">
				<ProposalPanelHeader title={proposal.title} onClose={togglePanel} />
				<Box className={css({ px: "5" })}>
					<VStack gap="3">
						<ProposalPanelAuthor name={proposal.creator.name} />
						<ProposalPanelMeta
							dateLabel={DateTime.fromISO(
								proposal.publishedAt as string,
							).toLocaleString(DateTime.DATE_MED)}
							locationLabel={locationLabel}
						/>
						<ProposalPanelCategories categories={proposal.categories} />
						<ProposalPanelTabs
							activeTab={activeTab}
							onValueChange={setActiveTab}
							commentCount={proposal.commentCount}
						/>
					</VStack>
				</Box>
			</VStack>
			{activeTab === "about" ? (
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
