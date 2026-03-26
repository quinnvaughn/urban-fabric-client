import {
	useApolloClient,
	useMutation,
	useReadQuery,
} from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
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
import { useGettingStartedModal } from "#/features/modals/getting-started-modal"

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
	useGettingStartedModal()
	const [updateTitle] = useMutation(UpdateFabricTitleDocument)
	const [syncViewport] = useMutation(SyncViewportDocument)
	const [updateThumbnail] = useMutation(UpdateFabricThumbnailDocument)
	const [updateMapStyle] = useMutation(UpdateFabricMapStyleDocument)
	const [mapStyle, setMapStyle] = useState(fabric.mapStyle)
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
		<MobileGate>
			<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
				<EditorTopbar
					id={fabric.id}
					title={fabric.title}
					{...(fabric.proposal
						? { hasProposal: true, slug: fabric.proposal.slug }
						: { hasProposal: false })}
					onTitleSave={async (title) => {
						await updateTitle({
							variables: { input: { id: fabric.id, title } },
						})
					}}
					mapStyle={mapStyle}
					onMapStyleChange={(style) => {
						setMapStyle(style)
						updateMapStyle({
							variables: { input: { id: fabric.id, mapStyle: style } },
						})
					}}
				/>
				<ElementPanel />
				<PropertiesPanel />
				<EditorCommandPalette />
				<FabricMap
					center={[fabric.center.lng, fabric.center.lat]}
					zoom={fabric.zoom}
					bearing={0}
					mapStyle={mapStyle}
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
		</MobileGate>
	)
}
