import { useMutation, useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useRef } from "react"
import { useAnalytics } from "#/lib/analytics"
import {
	ProposalDesktopView,
	ProposalMobileView,
	ProposalPageSkeleton,
	useProposalStore,
} from "#/features/proposal"
import {
	GetProposalDocument,
	type GetProposalQuery,
	RecordProposalViewDocument,
} from "#/graphql/generated"
import { adjustMyDashboardEngagementCache } from "#/lib/apollo"
import { getClientEnv } from "#/lib/env/client"
import { useCurrentUser } from "#/lib/graphql/hooks/use-current-user"

export const Route = createFileRoute("/proposal/$slug/")({
	component: RouteComponent,
	pendingComponent: ProposalPageSkeleton,
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
				{
					property: "og:image",
					content: proposal.snapshotThumbnail ?? `${siteUrl}/og-image.png`,
				},
				{ property: "og:type", content: "article" },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
				{
					name: "twitter:image",
					content: proposal.snapshotThumbnail ?? `${siteUrl}/og-image.png`,
				},
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
	const [recordView] = useMutation(RecordProposalViewDocument)
	const { data: meData } = useCurrentUser()
	const hasRecordedView = useRef(false)
	const isOwner = meData?.me?.id === proposal.creator.id
	const { capture } = useAnalytics()

	// biome-ignore lint/correctness/useExhaustiveDependencies: stable
	useEffect(() => {
		if (!hasRecordedView.current) {
			capture("proposal_viewed", {
				proposal_id: proposal.id,
				category: proposal.categories[0] ?? "none",
			})
			recordView({
				variables: { input: { proposalId: proposal.id } },
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
		<>
			<ProposalMobileView proposal={proposal} />
			<ProposalDesktopView proposal={proposal} />
		</>
	)
}
