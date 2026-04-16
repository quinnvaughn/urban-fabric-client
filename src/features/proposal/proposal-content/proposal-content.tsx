import { DateTime } from "luxon"
import { useEffect } from "react"
import { Fragment } from "react/jsx-runtime"
import { Box, VStack } from "#/features/ui"
import type { GetProposalQuery } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { CommentsPanel } from "../../proposal-comment"
import { ProposalPanelTab, useProposalStore } from "../proposal-store"
import { ProposalAboutTab } from "./proposal-about-tab"
import { ProposalActionsFooter } from "./proposal-actions-footer"
import { ProposalLayersTab } from "./proposal-layers-tab"
import { ProposalPanelAuthor } from "./proposal-panel-author"
import { ProposalPanelCategories } from "./proposal-panel-categories"
import { ProposalPanelHeader } from "./proposal-panel-header"
import { ProposalPanelMeta } from "./proposal-panel-meta"
import { ProposalPanelTabs } from "./proposal-panel-tabs"
import { ProposalPhotosTab } from "./proposal-photos-tab"

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

type Props = {
	proposal: Proposal
	isMobile?: boolean
}

export function ProposalContent({ proposal, isMobile }: Props) {
	const { togglePanel, setActiveTab, activeTab, elements } = useProposalStore()
	const locationLabel = `${proposal.snapshotLocationCity}, ${proposal.snapshotLocationRegionAbbr ?? proposal.snapshotLocationRegion}`
	const photoCount = proposal.numPhotos
	const visibleActiveTab =
		activeTab === ProposalPanelTab.Photos && photoCount === 0
			? ProposalPanelTab.About
			: activeTab

	useEffect(() => {
		if (activeTab === ProposalPanelTab.Photos && photoCount === 0) {
			setActiveTab(ProposalPanelTab.About)
		}
	}, [activeTab, photoCount, setActiveTab])

	return (
		<Fragment>
			<VStack gap="3">
				<ProposalPanelHeader
					title={proposal.title}
					onClose={isMobile ? undefined : togglePanel}
				/>
				<Box className={css({ px: "5" })}>
					<VStack gap="3">
						<ProposalPanelAuthor
							name={proposal.creator.name}
							username={proposal.creator.username}
							profilePictureUrl={proposal.creator.profilePictureUrl}
							creatorId={proposal.creator.id}
							isFollowedByMe={proposal.creator.isFollowedByMe}
						/>
						<ProposalPanelMeta
							dateLabel={DateTime.fromISO(
								proposal.publishedAt as string,
							).toLocaleString(DateTime.DATE_MED)}
							locationLabel={locationLabel}
							viewCount={proposal.viewCount}
						/>
						<ProposalPanelCategories categories={proposal.categories} />
						<ProposalPanelTabs
							activeTab={visibleActiveTab}
							onValueChange={setActiveTab}
							commentCount={proposal.commentCount}
							photoCount={photoCount}
						/>
					</VStack>
				</Box>
			</VStack>
			{visibleActiveTab === ProposalPanelTab.About ? (
				<Fragment>
					<ProposalAboutTab
						description={proposal.description}
						elements={elements}
					/>
					<ProposalActionsFooter proposal={proposal} isMobile={isMobile} />
				</Fragment>
			) : visibleActiveTab === ProposalPanelTab.Layers ? (
				<Fragment>
					<ProposalLayersTab elements={elements} />
					<ProposalActionsFooter proposal={proposal} isMobile={isMobile} />
				</Fragment>
			) : visibleActiveTab === ProposalPanelTab.Photos && photoCount > 0 ? (
				<Fragment>
					<ProposalPhotosTab
						existingConditionPhotos={proposal.existingConditionPhotos}
						inspirationPhotos={proposal.inspirationPhotos}
					/>
					<ProposalActionsFooter proposal={proposal} isMobile={isMobile} />
				</Fragment>
			) : (
				<CommentsPanel slug={proposal.slug} />
			)}
		</Fragment>
	)
}
