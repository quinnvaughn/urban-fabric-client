import { useReadQuery } from "@apollo/client/react"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useEffect } from "react"
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
	beforeLoad: async ({ context, params }) => {
		// if draft proposal exists, redirect to it instead of creating a new one
		const { data } = await context.apolloClient.query({
			query: ProposalByFabricIdDocument,
			variables: {
				fabricId: params.id,
			},
		})

		if (data?.proposalByFabricId?.__typename === "Proposal") {
			throw redirect({
				to: "/proposal/$slug",
				params: { slug: data.proposalByFabricId.slug },
			})
		}
	},
	loader: ({ context, params }) => {
		const fabricQuery = context.preloadQuery(GetFabricDocument, {
			variables: {
				fabricId: params.id,
			},
		})
		return { fabricQuery }
	},
})

function RouteComponent() {
	const { fabricQuery } = Route.useLoaderData()
	const { data } = useReadQuery(fabricQuery)

	if (data.fabric.__typename === "NotFoundError") {
		return <div>Fabric not found</div>
	}
	const fabric = data.fabric

	return <Publish fabric={fabric} />
}

type Fabric = Extract<GetFabricQuery["fabric"], { __typename: "Fabric" }>

function Publish({ fabric }: { fabric: Fabric }) {
	const elements: ElementInstance[] = Array.isArray(fabric.elements)
		? (fabric.elements as ElementInstance[])
		: []
	const navigate = Route.useNavigate()
	const { capture } = useAnalytics()
	useEffect(() => {
		capture("page_viewed", { page: "publish" })
	}, [capture])

	return (
		<MobileGate size="lg">
			<ProposalFormPage
				mode="create"
				data={{
					topbarTitle: fabric.title,
					fabricId: fabric.id,
					elements,
					center: { lat: fabric.center.lat, lng: fabric.center.lng },
					zoom: fabric.zoom,
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
					navigate({ to: "/proposal/$slug", params: { slug } }).then(() => {
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
		</MobileGate>
	)
}
