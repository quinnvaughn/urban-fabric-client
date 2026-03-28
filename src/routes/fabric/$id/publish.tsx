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
		const [{ data: proposalData }, { data: fabricData }] = await Promise.all([
			context.apolloClient.query({
				query: ProposalByFabricIdDocument,
				variables: { fabricId: params.id },
			}),
			context.apolloClient.query({
				query: GetFabricDocument,
				variables: { fabricId: params.id },
			}),
		])

		// if draft proposal exists, redirect to it instead of creating a new one
		if (proposalData?.proposalByFabricId?.__typename === "Proposal") {
			throw redirect({
				to: "/proposal/$slug",
				params: { slug: proposalData.proposalByFabricId.slug },
			})
		}

		if (fabricData?.fabric.__typename === "UnauthorizedError") {
			throw redirect({ to: "/login", replace: true })
		}
		if (fabricData?.fabric.__typename === "ForbiddenError") {
			throw redirect({ to: "/dashboard", replace: true })
		}
		if (fabricData?.fabric.__typename === "NotFoundError") {
			throw redirect({ to: "/dashboard", replace: true })
		}
	},
	loader: ({ context, params }) => {
		const data = context.apolloClient.readQuery({
			query: GetFabricDocument,
			variables: { fabricId: params.id },
		})
		return { fabric: data?.fabric as Extract<GetFabricQuery["fabric"], { __typename: "Fabric" }> }
	},
})

function RouteComponent() {
	const { fabric } = Route.useLoaderData()
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
					navigate({ to: "/proposal/$slug", params: { slug } }).then(() => {
						setTimeout(() => {
							openModal("shareProposal", {
								link: `${window.location.origin}/proposal/${slug}`,
								title,
								eyebrow: "Your proposal is live!",
								description:
									"Share it with your community to get as many eyes on it as possible.",
								source: "post_create",
								isOwner: true,
							})
						}, 600)
					})
				}}
				onUnauthorized={() => navigate({ to: "/login", replace: true })}
			/>
		</MobileGate>
	)
}
