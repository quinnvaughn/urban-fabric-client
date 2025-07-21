import { createFileRoute } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { SimulationMapProvider } from "../../../../context"
import {
	LayerPropertiesPanel,
	SimulationMapFooter,
	SimulationMapHeader,
	SimulationMapLayers,
} from "../../../../features/simulation"
import { FabricMap } from "../../../../features/ui"
import { GetSimulationDocument } from "../../../../graphql/generated"
import { css } from "../../../../styles/styled-system/css"

export const Route = createFileRoute(
	"/_auth/dashboard/simulation/$simulationId",
)({
	component: RouteComponent,
	loader: async ({ params, context: { apolloClient } }) => {
		const { simulationId } = params
		if (!simulationId) {
			throw new Error("Simulation ID is required")
		}
		const { data } = await apolloClient.query({
			query: GetSimulationDocument,
			variables: { simulationId },
		})
		return {
			simulation: data.simulation,
			categories: data.categories,
		}
	},
	head: ({ loaderData }) => {
		if (!loaderData) {
			return {
				meta: [
					{
						name: "description",
						content: "Loading simulation...",
					},
					{
						title: "Loading - Urban Fabric",
					},
				],
			}
		}
		const { simulation } = loaderData
		if (!simulation) {
			return {
				meta: [
					{
						name: "description",
						content: "Simulation not found",
					},
					{
						title: "Simulation Not Found - Urban Fabric",
					},
				],
			}
		}
		if (simulation.__typename !== "Simulation") {
			return {
				meta: [
					{
						name: "description",
						content: "Invalid simulation",
					},
					{
						title: "Invalid Simulation - Urban Fabric",
					},
				],
			}
		}
		return {
			meta: [
				{
					name: "description",
					content: `Simulation: ${simulation.name}`,
				},
				{
					title: `${simulation.name} - Urban Fabric`,
				},
			],
		}
	},
})

function RouteComponent() {
	const { simulation, categories } = Route.useLoaderData()
	return (
		<div className={css({ height: "100vh", overflow: "hidden" })}>
			{match(simulation)
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
							<SimulationMapHeader name={simulation.name} id={simulation.id} />
							<SimulationMapLayers categories={categories} />
							<LayerPropertiesPanel />
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
