import { useMutation, useReadQuery } from "@apollo/client/react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { EllipsisVertical, MapPin } from "lucide-react"
import { useEffect, useRef } from "react"
import { FabricMap, MapControls } from "#/features/fabric"
import { Attribution } from "#/features/fabric/attribution"
import {
	ProposalElementsLayer,
	ProposalPanel,
	ProposalSelectLayer,
	SelectedInstancePanel,
	useProposalStore,
} from "#/features/proposal"
import { Box, HStack, Logo, Tooltip, Typography } from "#/features/ui"
import {
	GetProposalDocument,
	type GetProposalQuery,
	RecordProposalViewDocument,
} from "#/graphql/generated"
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
	const { togglePanel, isPanelOpen, selectedInstance, setSelectedInstanceId } =
		useProposalStore()

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
					<Link to="/">
						<Logo />
					</Link>
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
				<ProposalPanel proposal={proposal} />
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
