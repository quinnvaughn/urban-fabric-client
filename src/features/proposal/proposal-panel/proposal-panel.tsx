import { useMutation } from "@apollo/client/react"
import { ChevronLeft, Eye, Heart, Share } from "lucide-react"
import { DateTime } from "luxon"
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
import {
	type GetProposalQuery,
	ToggleProposalLikeDocument,
} from "#/graphql/generated"
import { useRequireAuth } from "#/lib/graphql"
import { enumValueToReadableLabel } from "#/lib/string"
import { openModal } from "#/stores"
import { css } from "#/styles/styled-system/css"
import { useProposalStore } from "../proposal-store"

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

export function ProposalPanel({ proposal }: { proposal: Proposal }) {
	const {
		togglePanel,
		isPanelOpen,
		setActiveTab,
		activeTab,
		activeElementTypes,
		elements,
	} = useProposalStore()
	const [toggleLike] = useMutation(ToggleProposalLikeDocument)
	const requireAuth = useRequireAuth(
		"Create an account or sign in to like this proposal",
	)

	function handleLike() {
		requireAuth(() => {
			toggleLike({
				variables: { input: { proposalId: proposal.id } },
				optimisticResponse: {
					__typename: "Mutation",
					toggleProposalLike: {
						__typename: "Proposal",
						id: proposal.id,
						isLikedByMe: !proposal.isLikedByMe,
						likeCount: proposal.isLikedByMe
							? proposal.likeCount - 1
							: proposal.likeCount + 1,
					},
				},
			})
		})
	}

	return (
		<Box
			id="panel"
			className={css({
				position: "absolute",
				top: 0,
				left: 0,
				width: "360px",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				background: "white",
				borderRight: "1px solid",
				borderRightColor: "border.subtle",
				transform: isPanelOpen ? "translateX(0)" : "translateX(-100%)",
				opacity: isPanelOpen ? 1 : 0,
				transition:
					"transform 280ms var(--easings-spring), opacity 200ms var(--easings-in-out)",
				zIndex: "floating",
			})}
		>
			<Box
				id="panel-header"
				className={css({
					flexShrink: 0,
					px: "5",
					paddingTop: "5",
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
			<Box
				className={css({ flex: 1, overflowY: "auto", px: "5", py: "4" })}
				id="panel-body"
			>
				<VStack gap="0">
					{activeTab === "about" ? (
						<VStack gap="2.5">
							<Divider label="Description" />
							<Typography.Text
								color="stone.700"
								size="md"
								lineHeight="relaxed"
								className={css({ whiteSpace: "pre-wrap" })}
							>
								{proposal.description}
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
				id="panel-footer"
				className={css({
					flexShrink: 0,
					borderTop: "1px solid",
					borderTopColor: "border.subtle",
					px: "5",
					py: "3.5",
					display: "flex",
					gap: "2",
					alignItems: "center",
				})}
			>
				<Button
					size="md"
					intent="brand"
					appearance={proposal.isLikedByMe ? "solid" : "subtle"}
					startIcon={<Heart size={16} />}
					className={css({ flex: 1 })}
					endIcon={
						<Typography.Text
							className={css({ color: "inherit", opacity: 0.7 })}
							weight="normal"
						>
							{new Intl.NumberFormat("en-US", {
								notation: "compact",
							}).format(proposal.likeCount)}
						</Typography.Text>
					}
					onClick={handleLike}
				>
					<Typography.Text
						className={css({ color: "inherit" })}
						weight="medium"
					>
						{proposal.isLikedByMe ? "Liked" : "Like"}
					</Typography.Text>
				</Button>
				<Button
					type="button"
					size="md"
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
			</Box>
		</Box>
	)
}
