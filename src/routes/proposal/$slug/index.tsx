import { useMutation, useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import {
	ChevronLeft,
	EllipsisVertical,
	Eye,
	Heart,
	MapPin,
	Share,
} from "lucide-react"
import { DateTime } from "luxon"
import { useEffect, useRef, useTransition } from "react"
import { FabricComposition, FabricMap, MapControls } from "#/features/fabric"
import { Attribution } from "#/features/fabric/attribution"
import {
	ProposalElementsLayer,
	ProposalSelectLayer,
	SelectedInstancePanel,
	useProposalStore,
} from "#/features/proposal"
import {
	Avatar,
	Badge,
	Box,
	Button,
	Divider,
	HStack,
	Logo,
	Swatch,
	Tabs,
	Tooltip,
	Typography,
	VStack,
} from "#/features/ui"
import {
	GetProposalDocument,
	type GetProposalQuery,
	RecordProposalViewDocument,
	ToggleProposalLikeDocument,
} from "#/graphql/generated"
import { enumValueToReadableLabel } from "#/lib/string"
import { openModal } from "#/stores"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/proposal/$slug/")({
	component: RouteComponent,
	loader: ({ params, context }) => {
		const getProposalQuery = context.preloadQuery(GetProposalDocument, {
			variables: {
				slug: params.slug,
			},
		})
		return {
			getProposalQuery,
		}
	},
})

function RouteComponent() {
	const { getProposalQuery } = Route.useLoaderData()
	const { data } = useReadQuery(getProposalQuery)
	const { initElements } = useProposalStore()

	// biome-ignore lint/correctness/useExhaustiveDependencies: stable
	useEffect(() => {
		if (data?.proposalBySlug?.__typename !== "NotFoundError") {
			initElements(data.proposalBySlug.snapshotElements as any)
		}
	}, [data])

	if (
		!data ||
		!data.proposalBySlug ||
		data.proposalBySlug.__typename === "NotFoundError"
	) {
		// TODO: better 404 page
		return <div>Proposal not found</div>
	}

	return <ProposalView proposal={data.proposalBySlug} />
}

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

function ProposalView({ proposal }: { proposal: Proposal }) {
	const {
		togglePanel,
		isPanelOpen,
		setActiveTab,
		activeTab,
		activeElementTypes,
		selectedInstance,
		setSelectedInstanceId,
		elements,
	} = useProposalStore()

	const [toggleLike] = useMutation(ToggleProposalLikeDocument)
	const [isPending, startTransition] = useTransition()
	const [recordView] = useMutation(RecordProposalViewDocument)
	const hasRecordedView = useRef(false)

	// biome-ignore lint/correctness/useExhaustiveDependencies: stable
	useEffect(() => {
		if (!hasRecordedView.current) {
			recordView({
				variables: {
					input: {
						proposalId: proposal.id,
					},
				},
			})
			hasRecordedView.current = true
		}
	}, [proposal.id])

	return (
		<Box
			className={css({
				display: "flex",
				flexDir: "column",
				background: "stone.100",
				h: "screen",
				w: "screen",
			})}
		>
			<Box
				id="top-bar"
				as="header"
				className={css({
					flexShrink: 0,
					height: "var(--uf-header-height)",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					px: "4",
					gap: "2.5",
					borderBottom: "1px solid",
					borderBottomColor: "border.subtle",
					background: "white",
					zIndex: "floating",
					animation: "fadeDown 0.36s (--easings-spring) both",
					transition:
						"height 250ms (--easings-spring), opacity 200ms (---easings-in-out), border-bottom-color 200ms",
					overflow: "hidden",
				})}
			>
				<HStack
					gap="2.5"
					className={css({ flex: 1, minWidth: 0 })}
					align="center"
				>
					<Logo />
					<Box
						className={css({
							width: "px",
							height: "18px",
							background: "stone.200",
							flexShrink: 0,
						})}
					/>
					<Typography.Text truncate color="stone.700" weight="medium" size="md">
						{proposal.title}
					</Typography.Text>
					<HStack
						gap="1"
						align="center"
						className={css({ flexShrink: 0, color: "stone.500" })}
					>
						<MapPin size={10} />
						<Typography.Text
							size="xs"
							className={css({ color: "inherit" })}
						>{`${proposal.snapshotLocationCity}, ${proposal.snapshotLocationRegionAbbr ?? proposal.snapshotLocationRegion}`}</Typography.Text>
					</HStack>
				</HStack>
			</Box>
			<Box
				id="shell"
				className={css({
					flex: 1,
					position: "relative",
					minH: 0,
					overflow: "hidden",
				})}
			>
				<Tooltip side="right">
					<Tooltip.Trigger>
						<button
							aria-label="Open panel"
							id="panel-handle"
							type="button"
							onClick={togglePanel}
							className={css({
								position: "absolute",
								left: 0,
								top: "50%",
								transform: "translateY(-50%)",
								zIndex: "floating",
								width: "3",
								height: "12",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								color: "stone.400",
								background: isPanelOpen
									? "transparent"
									: { base: "white", _hover: "stone.100" },
								border: "1px solid",
								borderColor: "border.subtle",
								borderLeft: "none",
								borderRadius: "0 var(--radii-md) var(--radii-md) 0",
								boxShadow: "sm",
								opacity: isPanelOpen ? 0 : 1,
								pointerEvents: isPanelOpen ? "none" : "auto",
								transition:
									"opacity 200ms (--easings-in-out), background 150ms (--easings-in-out)",
							})}
						>
							<EllipsisVertical size={14} />
						</button>
					</Tooltip.Trigger>
					<Tooltip.Content>Open panel</Tooltip.Content>
				</Tooltip>
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
									{DateTime.fromISO(
										proposal.publishedAt as string,
									).toLocaleString(DateTime.DATE_MED)}
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
									setActiveTab(value as "about" | "legend")
								}
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
							loading={isPending}
							onClick={() => {
								startTransition(async () => {
									await toggleLike({
										variables: {
											input: {
												proposalId: proposal.id,
											},
										},
									})
								})
							}}
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
				<Box
					className={css({
						position: "absolute",
						top: 0,
						right: 0,
						width: "280px",
						height: "100%",
						display: "flex",
						flexDirection: "column",
						background: "white",
						borderLeft: "1px solid",
						borderLeftColor: "border.subtle",
						transform: selectedInstance ? "translateX(0)" : "translateX(100%)",
						opacity: selectedInstance ? 1 : 0,
						transition:
							"transform 280ms var(--easings-spring), opacity 200ms var(--easings-in-out)",
						zIndex: "floating",
					})}
				>
					{selectedInstance && (
						<SelectedInstancePanel
							instance={selectedInstance}
							onClose={() => setSelectedInstanceId("")}
						/>
					)}
				</Box>
				<FabricMap
					center={[proposal.snapshotCenter.lng, proposal.snapshotCenter.lat]}
					zoom={proposal.snapshotZoom}
				>
					<ProposalSelectLayer />
					<Box
						className={css({
							position: "absolute",
							bottom: "20px",
							left: "20px",
							right: "20px",
							zIndex: "panel",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "end",
						})}
					>
						<Attribution />
						<MapControls showHelp={false} />
					</Box>
					<ProposalElementsLayer />
				</FabricMap>
			</Box>
		</Box>
	)
}
