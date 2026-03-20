import { useReadQuery } from "@apollo/client/react"
import { createFileRoute, redirect } from "@tanstack/react-router"
import type { ElementInstance } from "#/features/fabric/element-types/types"
import { ProposalFormPage } from "#/features/proposal"
import {
	GetFabricDocument,
	type GetFabricQuery,
	ProposalByFabricIdDocument,
} from "#/graphql/generated"

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

	return (
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
			onPublishSuccess={(slug) =>
				navigate({ to: "/proposal/$slug", params: { slug } })
			}
			onUnauthorized={() => navigate({ to: "/login", replace: true })}
		/>
	)
}
