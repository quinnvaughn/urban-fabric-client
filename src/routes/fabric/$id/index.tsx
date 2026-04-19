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
import {
	GettingStartedNudge,
	useGettingStartedNudge,
} from "#/features/modals/getting-started-modal"
import { MobileGate } from "#/features/ui"
import {
	GetFabricDocument,
	type GetFabricQuery,
	SyncViewportDocument,
	UpdateFabric3DModeDocument,
	UpdateFabricMapStyleDocument,
	UpdateFabricThumbnailDocument,
	UpdateFabricTitleDocument,
} from "#/graphql/generated"
import { useAnalytics } from "#/lib/analytics"
import { evictFabricListCaches } from "#/lib/apollo"
import { useCurrentUser } from "#/lib/graphql/hooks/use-current-user"
import { uploadFabricThumbnail } from "#/lib/upload/thumbnail-upload"

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
	const [updateTitle] = useMutation(UpdateFabricTitleDocument)
	const [syncViewport] = useMutation(SyncViewportDocument)
	const [updateThumbnail] = useMutation(UpdateFabricThumbnailDocument)
	const [updateMapStyle] = useMutation(UpdateFabricMapStyleDocument)
	const [updateIsIn3DMode] = useMutation(UpdateFabric3DModeDocument)
	const { capture } = useAnalytics()
	useFabricPersistence(apiHandler(fabric.id, client))
	const { user } = useCurrentUser()
	const isOwner = user?.id === fabric.creator.id
	const {
		showNudge: showGettingStartedNudge,
		dismissNudge: dismissGettingStartedNudge,
	} = useGettingStartedNudge()

	useEffect(() => {
		capture("page_viewed", { page: "editor" })
	}, [capture])

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore
	useEffect(() => {
		initElements(fabric.elements)
	}, [fabric.id])

	return (
		<>
			<GettingStartedNudge
				show={showGettingStartedNudge}
				onDismiss={dismissGettingStartedNudge}
			/>
			<FabricEditor
				id={fabric.id}
				title={fabric.title}
				center={[fabric.center.lng, fabric.center.lat]}
				zoom={fabric.zoom}
				initialMapStyle={fabric.mapStyle}
				initialIsIn3DMode={fabric.isIn3DMode}
				{...(fabric.proposal
					? { hasProposal: true, slug: fabric.proposal.slug }
					: { hasProposal: false })}
				captureOnMount={!fabric.thumbnail}
				onTitleSave={
					isOwner
						? async (title) => {
								await updateTitle({
									variables: { input: { id: fabric.id, title } },
								})
							}
						: undefined
				}
				onMapStyleChange={
					isOwner
						? (style) => {
								updateMapStyle({
									variables: { input: { id: fabric.id, mapStyle: style } },
								})
							}
						: undefined
				}
				onIsIn3DModeChange={
					isOwner
						? (isIn3DMode) => {
								updateIsIn3DMode({
									variables: {
										input: { id: fabric.id, isIn3DMode },
									},
								})
							}
						: undefined
				}
				onViewportChange={
					isOwner
						? async (viewport) => {
								await syncViewport({
									variables: { input: { id: fabric.id, ...viewport } },
								})
							}
						: undefined
				}
				onThumbnail={
					isOwner
						? async (thumbnail) => {
								try {
									const publicUrl = await uploadFabricThumbnail(
										client,
										fabric.id,
										thumbnail,
									)
									await updateThumbnail({
										variables: {
											input: { id: fabric.id, thumbnail: publicUrl },
										},
										update(cache, { data }) {
											if (data?.updateFabricThumbnail.__typename !== "Fabric") {
												return
											}
											evictFabricListCaches(cache)
										},
									})
									return publicUrl
								} catch {
									return fabric.thumbnail ?? ""
								}
							}
						: undefined
				}
			/>
		</>
	)
}
