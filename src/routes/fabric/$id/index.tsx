import { useApolloClient, useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import {
	DrawingLayer,
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
import { ViewportTracker } from "#/features/fabric/viewport-tracker"
import { GetFabricDocument, type GetFabricQuery } from "#/graphql/generated"

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
	const initElements = useFabricStore((state) => state.initElements)
	useFabricPersistence(apiHandler(fabric.id, client))

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore
	useEffect(() => {
		initElements(fabric.elements)
	}, [fabric.id])

	return (
		<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
			<EditorTopbar id={fabric.id} title={fabric.title} />
			<ElementPanel />
			<PropertiesPanel />
			<FabricMap
				center={[fabric.viewportCenter.lng, fabric.viewportCenter.lat]}
				zoom={fabric.viewportZoom}
				bearing={fabric.viewportBearing}
			>
				<DrawingLayer />
				<SelectLayer />
				<ViewportTracker id={fabric.id} />
				<EditorHUD />
			</FabricMap>
		</div>
	)
}
