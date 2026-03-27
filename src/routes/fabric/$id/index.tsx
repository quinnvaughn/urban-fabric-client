import { useApolloClient, useMutation } from "@apollo/client/react"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useEffect } from "react"
import { FabricEditor, FabricEditorSkeleton } from "#/features/fabric"
import { apiHandler } from "#/features/fabric/element-types/types"
import {
	useFabricPersistence,
	useFabricStore,
} from "#/features/fabric/fabric-store"
import { useGettingStartedModal } from "#/features/modals/getting-started-modal"
import {
	GetFabricDocument,
	type GetFabricQuery,
	SyncViewportDocument,
	UpdateFabricMapStyleDocument,
	UpdateFabricThumbnailDocument,
	UpdateFabricTitleDocument,
} from "#/graphql/generated"
import { useAnalytics } from "#/lib/analytics"

export const Route = createFileRoute("/fabric/$id/")({
	component: RouteComponent,
	pendingComponent: FabricEditorSkeleton,
	beforeLoad: async ({ context, params }) => {
		const { data } = await context.apolloClient.query({
			query: GetFabricDocument,
			variables: { fabricId: params.id },
		})

		if (data?.fabric.__typename === "UnauthorizedError") {
			throw redirect({ to: "/login", replace: true })
		}
		if (data?.fabric.__typename === "ForbiddenError") {
			throw redirect({ to: "/dashboard", replace: true })
		}
		if (data?.fabric.__typename === "NotFoundError") {
			throw redirect({ to: "/dashboard", replace: true })
		}
	},
	loader: ({ context, params }) => {
		const data = context.apolloClient.readQuery({
			query: GetFabricDocument,
			variables: { fabricId: params.id },
		})
		return {
			fabric: data?.fabric as Extract<
				GetFabricQuery["fabric"],
				{ __typename: "Fabric" }
			>,
		}
	},
})

type Fabric = Extract<GetFabricQuery["fabric"], { __typename: "Fabric" }>

function RouteComponent() {
	const { fabric } = Route.useLoaderData()
	return <FabricEditorRoute fabric={fabric} />
}

function FabricEditorRoute({ fabric }: { fabric: Fabric }) {
	const client = useApolloClient()
	const { initElements } = useFabricStore()
	useGettingStartedModal()
	const [updateTitle] = useMutation(UpdateFabricTitleDocument)
	const [syncViewport] = useMutation(SyncViewportDocument)
	const [updateThumbnail] = useMutation(UpdateFabricThumbnailDocument)
	const [updateMapStyle] = useMutation(UpdateFabricMapStyleDocument)
	const { capture } = useAnalytics()
	useFabricPersistence(apiHandler(fabric.id, client))

	useEffect(() => {
		capture("page_viewed", { page: "editor" })
	}, [capture])

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore
	useEffect(() => {
		initElements(fabric.elements)
	}, [fabric.id])

	return (
		<FabricEditor
			id={fabric.id}
			title={fabric.title}
			center={[fabric.center.lng, fabric.center.lat]}
			zoom={fabric.zoom}
			initialMapStyle={fabric.mapStyle}
			{...(fabric.proposal
				? { hasProposal: true, slug: fabric.proposal.slug }
				: { hasProposal: false })}
			captureOnMount={!fabric.thumbnail}
			onTitleSave={async (title) => {
				await updateTitle({
					variables: { input: { id: fabric.id, title } },
				})
			}}
			onMapStyleChange={(style) => {
				updateMapStyle({
					variables: { input: { id: fabric.id, mapStyle: style } },
				})
			}}
			onViewportChange={async (viewport) => {
				await syncViewport({
					variables: { input: { id: fabric.id, ...viewport } },
				})
			}}
			onThumbnail={async (thumbnail) => {
				await updateThumbnail({
					variables: { input: { id: fabric.id, thumbnail } },
				})
			}}
		/>
	)
}
