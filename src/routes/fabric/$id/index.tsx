import {
	useApolloClient,
	useMutation,
	useReadQuery,
} from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { match } from "ts-pattern"
import { ForbiddenView, NotFoundView } from "#/features/errors"
import { FabricEditor, FabricEditorSkeleton } from "#/features/fabric"
import { apiHandler } from "#/features/fabric/element-types/types"
import {
	useFabricPersistence,
	useFabricStore,
} from "#/features/fabric/fabric-store"
import { useGettingStartedModal } from "#/features/modals/getting-started-modal"
import { MobileGate } from "#/features/ui"
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
	loader: ({ context: { preloadQuery }, params }) => {
		const getFabricQuery = preloadQuery(GetFabricDocument, {
			variables: { fabricId: params.id },
		})
		return {
			getFabricQuery,
		}
	},
})

type Fabric = Extract<GetFabricQuery["fabric"], { __typename: "Fabric" }>

function RouteComponent() {
	const { getFabricQuery } = Route.useLoaderData()
	const { data } = useReadQuery(getFabricQuery)
	const navigate = Route.useNavigate()

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
			<MobileGate>
				<FabricEditorRoute fabric={fabric} />
			</MobileGate>
		))
		.otherwise(() => <ForbiddenView />)
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
