import { useMutation, useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { EllipsisVertical } from "lucide-react"
import { useEffect, useRef } from "react"
import { FabricMap, MapControls } from "#/features/fabric"
import { Attribution } from "#/features/fabric/attribution"
import {
	ProposalElementsLayer,
	ProposalPanel,
	ProposalPublicHeader,
	ProposalSelectLayer,
	SelectedInstancePanel,
	useProposalStore,
} from "#/features/proposal"
import { Box, Tooltip } from "#/features/ui"
import {
	GetProposalDocument,
	type GetProposalQuery,
	RecordProposalViewDocument,
} from "#/graphql/generated"
import { adjustMyDashboardEngagementCache } from "#/lib/apollo"
import { getClientEnv } from "#/lib/env/client"
import { useCurrentUser } from "#/lib/graphql/hooks/use-current-user"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/proposal/$slug/")({
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
	head: ({ loaderData }) => {
		const { VITE_SITE_URL: siteUrl } = getClientEnv()
		const proposal = loaderData?.proposalData?.proposalBySlug
		if (!proposal || proposal.__typename !== "Proposal") {
			return { meta: [{ title: "Urban Fabric" }] }
		}
		const location = `${proposal.snapshotLocationCity}, ${proposal.snapshotLocationRegionAbbr ?? proposal.snapshotLocationRegion}`
		const title = `${proposal.title} | Urban Fabric`
		const description = `${proposal.title} in ${location} — street redesign proposal on Urban Fabric.`
		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:image", content: `${siteUrl}/og-image.png` },
				{ property: "og:type", content: "article" },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
				{ name: "twitter:image", content: `${siteUrl}/og-image.png` },
			],
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
	const { data: meData } = useCurrentUser()
	const hasRecordedView = useRef(false)
	const isOwner = meData?.me?.id === proposal.creator.id

	// biome-ignore lint/correctness/useExhaustiveDependencies: stable
	useEffect(() => {
		if (!hasRecordedView.current) {
			recordView({
				variables: {
					input: {
						proposalId: proposal.id,
					},
				},
				update(cache, { data }) {
					if (!data?.recordProposalView) return
					if (!isOwner) return
					adjustMyDashboardEngagementCache(cache, { viewsDelta: 1 })
				},
			})
			hasRecordedView.current = true
		}
	}, [isOwner, proposal.id])

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
			<ProposalPublicHeader
				title={proposal.title}
				city={proposal.snapshotLocationCity}
				region={
					proposal.snapshotLocationRegionAbbr ?? proposal.snapshotLocationRegion
				}
			/>
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
