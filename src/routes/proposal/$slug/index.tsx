import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { ChevronLeft, EllipsisVertical, Eye, MapPin } from "lucide-react"
import { DateTime } from "luxon"
import { FabricMap } from "#/features/fabric"
import { ProposalElementsLayer, useProposalStore } from "#/features/proposal"
import {
	Avatar,
	Badge,
	Box,
	Button,
	Divider,
	HStack,
	Logo,
	Tabs,
	Tooltip,
	Typography,
	VStack,
} from "#/features/ui"
import { GetProposalDocument } from "#/graphql/generated"
import { enumValueToReadableLabel } from "#/lib/string"
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
	const isPanelOpen = useProposalStore((state) => state.isPanelOpen)
	const togglePanel = useProposalStore((state) => state.togglePanel)
	const activeTab = useProposalStore((state) => state.activeTab)
	const setActiveTab = useProposalStore((state) => state.setActiveTab)
	const initElements = useProposalStore((state) => state.initElements)
	const selectedInstance = useProposalStore(
		(state) =>
			state.elements.find((e) => e.id === state.selectedInstanceId) ?? null,
	)

	if (
		!data ||
		!data.proposalBySlug ||
		data.proposalBySlug.__typename === "NotFoundError"
	) {
		// TODO: better 404 page
		return <div>Proposal not found</div>
	}

	initElements(data.proposalBySlug.snapshotElements as any)

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
						{data.proposalBySlug.title}
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
						>{`${data.proposalBySlug.snapshotLocationCity}, ${data.proposalBySlug.snapshotLocationRegionAbbr ?? data.proposalBySlug.snapshotLocationRegion}`}</Typography.Text>
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
										tracking="wider"
									>
										Proposal
									</Typography.Text>
									<Typography.Heading
										as="h1"
										font="serif"
										size="md"
										weight="light"
										leading="tight"
										tracking="snug"
										italic
									>
										{data.proposalBySlug.title}
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
								<Avatar size="xs" name={data.proposalBySlug.creator.name} />
								<Typography.Text size="sm" color="stone.700" weight="medium">
									{data.proposalBySlug.creator.name}
								</Typography.Text>
							</HStack>
							<HStack gap="2" wrap>
								<Typography.Text size="sm" color="stone.500">
									{DateTime.fromISO(
										data.proposalBySlug.createdAt,
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
									{`${data.proposalBySlug.snapshotLocationCity}, ${data.proposalBySlug.snapshotLocationRegionAbbr ?? data.proposalBySlug.snapshotLocationRegion}`}
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
									}).format(data.proposalBySlug.viewCount)}
								</Box>
							</HStack>
							<HStack gap="1" wrap>
								{data.proposalBySlug.categories.map((category) => (
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
						className={css({ flex: 1, overflowY: "auto", px: "5" })}
						id="panel-body"
					>
						{activeTab === "about" ? (
							<VStack gap="2.5" className={css({ paddingTop: "4" })}>
								<Divider label="Description" />
								<Typography.Text
									color="stone.700"
									size="md"
									leading="loose"
									className={css({ whiteSpace: "pre-wrap" })}
								>
									{data.proposalBySlug.description}
								</Typography.Text>
							</VStack>
						) : (
							<VStack className={css({ paddingTop: "4" })}>
								<Divider label="Element Types" />
							</VStack>
						)}
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
					Box
				</Box>
				<FabricMap
					center={[
						data.proposalBySlug.snapshotCenter.lng,
						data.proposalBySlug.snapshotCenter.lat,
					]}
					zoom={data.proposalBySlug.snapshotZoom}
				>
					<ProposalElementsLayer />
				</FabricMap>
			</Box>
		</Box>
	)
}
