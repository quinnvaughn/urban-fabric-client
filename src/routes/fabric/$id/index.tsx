import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import {
	DrawingLayer,
	EditorHUD,
	EditorTopbar,
	ElementPanel,
	FabricMap,
} from "#/features/fabric"
import { ViewportTracker } from "#/features/fabric/viewport-tracker"
import { GetFabricDocument } from "#/graphql/generated"

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

	return (
		<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
			<EditorTopbar id={data.fabric.id} title={data.fabric.title} />
			<ElementPanel />
			<FabricMap
				center={[
					data.fabric.viewportCenter.lng,
					data.fabric.viewportCenter.lat,
				]}
				zoom={data.fabric.viewportZoom}
				bearing={data.fabric.viewportBearing}
			>
				<DrawingLayer />
				<ViewportTracker id={data.fabric.id} />
				<EditorHUD />
			</FabricMap>
		</div>
	)
}
