import {
	useApolloClient,
	useMutation,
	useReadQuery,
} from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import {
	DrawingLayer,
	EditorCommandPalette,
	EditorHUD,
	EditorTopbar,
	ElementPanel,
	FabricMap,
	PropertiesPanel,
	SelectLayer,
} from "#/features/fabric"
import { apiHandler } from "#/features/fabric/element-types/types"
import {
	useFabricPersistence,
	useFabricStore,
} from "#/features/fabric/fabric-store"
import { ThumbnailSync } from "#/features/fabric/thumbnail-sync"
import { ViewportTracker } from "#/features/fabric/viewport-tracker"
import {
	GetFabricDocument,
	type GetFabricQuery,
	SyncViewportDocument,
	UpdateFabricThumbnailDocument,
	UpdateFabricTitleDocument,
} from "#/graphql/generated"

export const Route = createFileRoute("/fabric/$id/")({
	component: RouteComponent,
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

	return <FabricEditor fabric={data.fabric} />
}

type Fabric = Extract<GetFabricQuery["fabric"], { __typename: "Fabric" }>

function FabricEditor({ fabric }: { fabric: Fabric }) {
	const client = useApolloClient()
	const { initElements } = useFabricStore()
	const [updateTitle] = useMutation(UpdateFabricTitleDocument)
	const [syncViewport] = useMutation(SyncViewportDocument)
	const [updateThumbnail] = useMutation(UpdateFabricThumbnailDocument)
	useFabricPersistence(apiHandler(fabric.id, client))

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore
	useEffect(() => {
		initElements(fabric.elements)
	}, [fabric.id])

	return (
		<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
			<EditorTopbar
				id={fabric.id}
				title={fabric.title}
				{...(fabric.proposal
					? { hasProposal: true, slug: fabric.proposal.slug }
					: { hasProposal: false })}
				onTitleSave={async (title) => {
					await updateTitle({ variables: { input: { id: fabric.id, title } } })
				}}
			/>
			<ElementPanel />
			<PropertiesPanel />
			<EditorCommandPalette />
			<FabricMap
				center={[fabric.center.lng, fabric.center.lat]}
				zoom={fabric.zoom}
				bearing={0}
			>
				<DrawingLayer />
				<SelectLayer />
				<ViewportTracker
					onViewportChange={async (viewport) => {
						await syncViewport({
							variables: { input: { id: fabric.id, ...viewport } },
						})
					}}
				/>
				<ThumbnailSync
					onThumbnail={async (thumbnail) => {
						await updateThumbnail({
							variables: { input: { id: fabric.id, thumbnail } },
						})
					}}
					captureOnMount={!fabric.thumbnail}
				/>
				<EditorHUD />
			</FabricMap>
		</div>
	)
}
