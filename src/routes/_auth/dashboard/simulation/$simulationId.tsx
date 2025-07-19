import { useReadQuery } from "@apollo/client/index.js"
import { createFileRoute } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { SimulationMapProvider } from "../../../../context"
import {
	SimulationMapFooter,
	SimulationMapHeader,
} from "../../../../features/simulation"
import { FabricMap } from "../../../../features/ui"
import { GetSimulationDocument } from "../../../../graphql/generated"
import { css } from "../../../../styles/styled-system/css"

export const Route = createFileRoute(
	"/_auth/dashboard/simulation/$simulationId",
)({
	component: RouteComponent,
	loader: async ({ params, context: { preloadQuery } }) => {
		const { simulationId } = params
		if (!simulationId) {
			throw new Error("Simulation ID is required")
		}
		const queryRef = preloadQuery(GetSimulationDocument, {
			variables: { simulationId },
		})
		return { queryRef }
	},
})

function RouteComponent() {
	const { queryRef } = Route.useLoaderData()
	const { data } = useReadQuery(queryRef)
	return (
		<div className={css({ height: "100vh", overflow: "hidden" })}>
			{match(data.simulation)
				.with({ __typename: "Simulation" }, (simulation) => (
					<FabricMap>
						<FabricMap.Layer
							id="3d-buildings"
							source="composite"
							source-layer="building"
							type="fill-extrusion"
							filter={["==", ["get", "extrude"], "true"]}
							paint={{
								"fill-extrusion-color": "#aaa",
								"fill-extrusion-height": ["get", "height"],
								"fill-extrusion-base": ["get", "min_height"],
								"fill-extrusion-opacity": 0.6,
							}}
						/>
						<SimulationMapProvider>
							<SimulationMapHeader simulationName={simulation.name} />
							<SimulationMapFooter />
						</SimulationMapProvider>
					</FabricMap>
				))
				// TODO: Handle error cases.
				.otherwise(() => (
					<div>error</div>
				))}
		</div>
	)
}
