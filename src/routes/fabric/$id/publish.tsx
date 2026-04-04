import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { match } from "ts-pattern"
import { ForbiddenView, NotFoundView } from "#/features/errors"
import type { ElementInstance } from "#/features/fabric/element-types/types"
import { ProposalFormPage } from "#/features/proposal"
import { MobileGate } from "#/features/ui"
import {
	GetFabricDocument,
	type GetFabricQuery,
	ProposalByFabricIdDocument,
} from "#/graphql/generated"
import { useAnalytics } from "#/lib/analytics"
import { openModal } from "#/stores"

export const Route = createFileRoute("/fabric/$id/publish")({
	component: RouteComponent,
	loader: ({ context: { preloadQuery }, params }) => {
		const getFabricQuery = preloadQuery(GetFabricDocument, {
			variables: { fabricId: params.id },
		})
		const getProposalQuery = preloadQuery(ProposalByFabricIdDocument, {
			variables: { fabricId: params.id },
		})
		return { getFabricQuery, getProposalQuery }
	},
})

type Fabric = Extract<GetFabricQuery["fabric"], { __typename: "Fabric" }>

function RouteComponent() {
	const { getFabricQuery, getProposalQuery } = Route.useLoaderData()
	const { data } = useReadQuery(getFabricQuery)
	const { data: proposalData } = useReadQuery(getProposalQuery)
	const navigate = Route.useNavigate()

	if (proposalData?.proposalByFabricId?.__typename === "Proposal") {
		navigate({
			to: "/proposal/$slug",
			params: { slug: proposalData.proposalByFabricId.slug },
			search: { tab: undefined, comment: undefined, parent: undefined },
		})
		return null
	}

	return match(data?.fabric)
		.with({ __typename: "UnauthorizedError" }, () => {
			navigate({ to: "/login", replace: true })
			return null
		})
		.with({ __typename: "ForbiddenError" }, () => <ForbiddenView />)
		.with({ __typename: "NotFoundError" }, () => {
			return <NotFoundView />
		})
		.with({ __typename: "Fabric" }, (fabric) => (
			<MobileGate size="lg">
				<PublishRoute fabric={fabric} />
			</MobileGate>
		))
		.otherwise(() => <ForbiddenView />)
}

function PublishRoute({ fabric }: { fabric: Fabric }) {
	const elements: ElementInstance[] = Array.isArray(fabric.elements)
		? (fabric.elements as ElementInstance[])
		: []
	const navigate = Route.useNavigate()
	const { capture } = useAnalytics()

	useEffect(() => {
		capture("page_viewed", { page: "publish" })
	}, [capture])

	return (
		<ProposalFormPage
			mode="create"
			data={{
				topbarTitle: fabric.title,
				fabricId: fabric.id,
				elements,
				center: { lat: fabric.center.lat, lng: fabric.center.lng },
				zoom: fabric.zoom,
				mapStyle: fabric.mapStyle,
				initialThumbnail: fabric.thumbnail ?? "",
				location: {
					city: fabric.locationCity,
					region: fabric.locationRegion,
					regionAbbr: fabric.locationRegionAbbr,
				},
				fabricRef: { id: fabric.id, title: fabric.title },
				initialValues: { title: "", description: "", categories: [] },
			}}
			onPublishSuccess={(slug, title) => {
				navigate({
					to: "/proposal/$slug",
					params: { slug },
					search: { tab: undefined, comment: undefined, parent: undefined },
				}).then(() => {
					setTimeout(() => {
						openModal("shareProposal", {
							link: `${window.location.origin}/proposal/${slug}`,
							title,
							eyebrow: "Your proposal is live!",
							description:
								"Share it with your community to get as many eyes on it as possible.",
							source: "post_create",
						})
					}, 600)
				})
			}}
			onUnauthorized={() => navigate({ to: "/login", replace: true })}
		/>
	)
}
