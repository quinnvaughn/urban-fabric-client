import { ChevronLeft, Eye } from "lucide-react"
import { DateTime } from "luxon"
import { Fragment } from "react/jsx-runtime"
import { FabricComposition } from "#/features/fabric"
import {
	Avatar,
	Badge,
	Box,
	Button,
	Divider,
	HStack,
	Swatch,
	Tabs,
	Tooltip,
	Typography,
	VStack,
} from "#/features/ui"
import type { GetProposalQuery } from "#/graphql/generated"
import { enumValueToReadableLabel } from "#/lib/string"
import { css } from "#/styles/styled-system/css"
import { CommentsPanel } from "../../proposal-comment"
import { useProposalStore } from "../proposal-store"
import { ProposalActionsFooter } from "./proposal-actions-footer"

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

type Props = {
	proposal: Proposal
	isMobile?: boolean
}

export function ProposalContent({ proposal, isMobile }: Props) {
	const { togglePanel, setActiveTab, activeTab, activeElementTypes, elements } =
		useProposalStore()

	const hasDescription = proposal.description && proposal.description.length > 0
	return (
		<Fragment>
			<Box
				className={css({
					px: "5",
					paddingTop: "4",
					flexShrink: 0,
				})}
			>
				<VStack gap="3">
					<HStack id="panel-header-top" gap="2.5" align="start">
						<VStack
							gap="1"
							id="panel-header-text"
							className={css({ flex: 1, minWidth: 0 })}
						>
							<Typography.Text
								size="xxs"
								color="coral.500"
								weight="semibold"
								transform="uppercase"
								letterSpacing="wider"
							>
								Proposal
							</Typography.Text>
							<Typography.Heading
								as="h1"
								font="serif"
								size="md"
								weight="light"
								lineHeight="tight"
								letterSpacing="snug"
								fontStyle="italic"
							>
								{proposal.title}
							</Typography.Heading>
						</VStack>
						{!isMobile && (
							<Tooltip>
								<Tooltip.Trigger>
									<Button
										appearance="ghost"
										intent="neutral"
										size="xs"
										onClick={togglePanel}
									>
										<ChevronLeft size={14} />
									</Button>
								</Tooltip.Trigger>
								<Tooltip.Content>Close panel</Tooltip.Content>
							</Tooltip>
						)}
					</HStack>
					<HStack align="center" gap="2" wrap>
						<Avatar size="xs" name={proposal.creator.name} />
						<Typography.Text size="sm" color="stone.700" weight="medium">
							{proposal.creator.name}
						</Typography.Text>
					</HStack>
					<HStack gap="2" wrap>
						<Typography.Text size="sm" color="stone.500">
							{DateTime.fromISO(proposal.publishedAt as string).toLocaleString(
								DateTime.DATE_MED,
							)}
						</Typography.Text>
						<Box
							className={css({
								width: "3px",
								height: "3px",
								background: "stone.300",
								borderRadius: "full",
							})}
						/>
						<Typography.Text size="sm" color="stone.500">
							{`${proposal.snapshotLocationCity}, ${proposal.snapshotLocationRegionAbbr ?? proposal.snapshotLocationRegion}`}
						</Typography.Text>
						<Box
							className={css({
								width: "3px",
								height: "3px",
								background: "stone.300",
								borderRadius: "full",
							})}
						/>
						<Box
							className={css({
								display: "flex",
								alignItems: "center",
								gap: "1",
								color: "stone.500",
								fontSize: "sm",
							})}
						>
							<Eye
								size={12}
								className={css({
									display: "inline-block",
									marginLeft: "2px",
								})}
							/>
							{new Intl.NumberFormat("en-US", {
								notation: "compact",
							}).format(proposal.viewCount)}
						</Box>
					</HStack>
					<HStack gap="1" wrap>
						{proposal.categories.map((category) => (
							<Badge key={category} size="xs" tone="accent">
								{enumValueToReadableLabel(category)}
							</Badge>
						))}
					</HStack>
					<Tabs
						stretch
						value={activeTab}
						onValueChange={(value) =>
							setActiveTab(value as "about" | "legend" | "comments")
						}
					>
						<Tabs.List>
							<Tabs.Trigger value="about">About</Tabs.Trigger>
							<Tabs.Trigger value="legend">Legend</Tabs.Trigger>
							<Tabs.Trigger value="comments">
								<HStack gap="1" align="center">
									<span>Comments</span>{" "}
									<Badge
										size="xxs"
										tone={activeTab === "comments" ? "brand" : "neutral"}
									>
										{proposal.commentCount}
									</Badge>
								</HStack>
							</Tabs.Trigger>
						</Tabs.List>
					</Tabs>
				</VStack>
			</Box>
			{activeTab === "about" ? (
				<Fragment>
					<VStack
						gap="2.5"
						className={css({ py: "4", overflowY: "auto", flex: 1, px: "5" })}
					>
						<Divider label="Description" />
						<Typography.Text
							color={hasDescription ? "stone.700" : "stone.400"}
							size="md"
							lineHeight="relaxed"
							weight={hasDescription ? "normal" : "medium"}
							fontStyle={hasDescription ? "normal" : "italic"}
							className={css({ whiteSpace: "pre-wrap" })}
						>
							{hasDescription
								? proposal.description
								: "No description available"}
						</Typography.Text>
						<FabricComposition elements={elements} />
					</VStack>
					<ProposalActionsFooter proposal={proposal} isMobile={isMobile} />
				</Fragment>
			) : activeTab === "legend" ? (
				<Fragment>
					<VStack
						gap="2.5"
						className={css({ py: "4", overflowY: "auto", flex: 1, px: "5" })}
					>
						<Divider label="Element Types" />
						{activeElementTypes.map((type) => (
							<HStack key={type.id} gap="3">
								<Swatch size="3.5" color={type.baseMapStyle.color} />
								<Typography.Text size="sm" color="stone.800">
									{type.title}
								</Typography.Text>
							</HStack>
						))}
					</VStack>
					<ProposalActionsFooter proposal={proposal} isMobile={isMobile} />
				</Fragment>
			) : (
				<CommentsPanel slug={proposal.slug} />
			)}
		</Fragment>
	)
}
