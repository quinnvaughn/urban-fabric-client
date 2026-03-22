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
import { LikeProposalButton } from "../like-proposal-button"
import { useProposalStore } from "../proposal-store"
import { ShareProposalButton } from "../share-proposal-button"

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
					py: "4",
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
						onValueChange={(value) => setActiveTab(value as "about" | "legend")}
					>
						<Tabs.List>
							<Tabs.Trigger value="about">About</Tabs.Trigger>
							<Tabs.Trigger value="legend">Legend</Tabs.Trigger>
						</Tabs.List>
					</Tabs>
				</VStack>
			</Box>
			<Box className={css({ flex: 1, overflowY: "auto", px: "5", py: "4" })}>
				<VStack gap="0">
					{activeTab === "about" ? (
						<VStack gap="2.5">
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
					) : (
						<VStack>
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
					)}
				</VStack>
			</Box>
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
		</Fragment>
	)
}
