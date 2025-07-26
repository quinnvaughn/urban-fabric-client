import { useMutation, useReadQuery } from "@apollo/client/index.js"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { match } from "ts-pattern"
import { SimulationMapProvider } from "../../../../context"
import {
	LayerPropertiesPanel,
	SimulationMapFooter,
	SimulationMapHeader,
	SimulationMapLayers,
} from "../../../../features/simulation"
import { FabricMap } from "../../../../features/ui"
import {
	GetSimulationDocument,
	UpdateLastViewedScenarioDocument,
} from "../../../../graphql/generated"
import { css } from "../../../../styles/styled-system/css"

export const Route = createFileRoute(
	"/_auth/dashboard/simulation/$simulationId/scenario/$scenarioId",
)({
	component: RouteComponent,
	loader: async ({ params, context: { preloadQuery, apolloClient } }) => {
		const queryRef = preloadQuery(GetSimulationDocument, {
			variables: {
				simulationId: params.simulationId,
			},
		})

		const { data } = await apolloClient.query({
			query: GetSimulationDocument,
			variables: {
				simulationId: params.simulationId,
			},
			fetchPolicy: "cache-first",
		})

		const simulationName =
			data.simulation.__typename === "Simulation"
				? data.simulation.name
				: "Unknown Simulation"

		return {
			queryRef,
			simulationName,
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
		const { simulationName } = loaderData
		return {
			meta: [
				{
					name: "description",
					content: `Simulation: ${simulationName}`,
				},
				{
					title: `${simulationName} - Urban Fabric`,
				},
			],
		}
	},
})

function RouteComponent() {
	// const { simulation, categories } = Route.useLoaderData()
	const { queryRef } = Route.useLoaderData()
	const { scenarioId, simulationId } = Route.useParams()
	const [updateLastViewedScenario] = useMutation(
		UpdateLastViewedScenarioDocument,
	)
	const {
		data: { simulation, categories },
	} = useReadQuery(queryRef)

	// Update the last viewed scenario when the component mounts or when scenarioId or simulationId changes
	useEffect(() => {
		updateLastViewedScenario({
			variables: {
				input: {
					scenarioId,
					simulationId,
				},
			},
		})
	}, [scenarioId, simulationId])

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
						<SimulationMapProvider
							simulation={simulation}
							categories={categories}
						>
							<SimulationMapHeader />
							<SimulationMapLayers />
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
