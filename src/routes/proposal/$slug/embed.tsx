import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { EllipsisVertical } from "lucide-react"
import { useEffect } from "react"
import { NotFoundView } from "#/features/errors"
import { FabricMap, MapControls } from "#/features/fabric"
import { Attribution } from "#/features/fabric/attribution"
import {
	EmbedProposalHeader,
	EmbedProposalPanel,
	ProposalElementsLayer,
	ProposalSelectLayer,
	SelectedInstancePanel,
	useProposalStore,
} from "#/features/proposal"
import {
	ProposalCommentLocationHighlight,
	ProposalCommentLocationPicker,
} from "#/features/proposal-comment"
import { Box, Tooltip } from "#/features/ui"
import { GetProposalDocument, type GetProposalQuery } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/proposal/$slug/embed")({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		const getProposalQuery = context.preloadQuery(GetProposalDocument, {
			variables: {
				slug: params.slug,
			},
		})
		const { data } = await context.apolloClient.query({
			query: GetProposalDocument,
			variables: { slug: params.slug },
		})
		return {
			getProposalQuery,
			proposalData: data,
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
		return <NotFoundView />
	}

	return <ProposalView proposal={data.proposalBySlug} />
}

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

type Props = {
	proposal: Proposal
}

function ProposalView({ proposal }: Props) {
	const { togglePanel, isPanelOpen, selectedInstance, setSelectedInstanceId } =
		useProposalStore()
	return (
		<Box
			className={css({
				display: { base: "none", md: "flex" },
				flexDir: "column",
				background: "stone.100",
				h: "screen",
				w: "screen",
			})}
		>
			<EmbedProposalHeader title={proposal.title} />
			<Box
				id="shell"
				className={css({
					flex: 1,
					position: "relative",
					minH: 0,
					overflow: "hidden",
				})}
			>
				<Tooltip placement="right">
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
				<EmbedProposalPanel proposal={proposal} />
				<Box
					className={css({
						position: "absolute",
						top: 0,
						right: 0,
						width: "200px",
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
						overflowY: "auto",
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
					mapStyle={proposal.snapshotMapStyle}
				>
					<ProposalCommentLocationHighlight />
					<ProposalCommentLocationPicker />
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
						<MapControls showHelp={false} showGetCurrentLocation={false} />
					</Box>
					<ProposalElementsLayer />
				</FabricMap>
			</Box>
		</Box>
	)
}
