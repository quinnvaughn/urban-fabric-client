import { useMutation, useReadQuery } from "@apollo/client/index.js"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { match } from "ts-pattern"
import { SimulationMapProvider } from "../../../../context"
import { SimulationMap } from "../../../../features/simulation"
import {
	GetCategoriesDocument,
	GetSimulationDocument,
	UpdateLastOpenedAtDocument,
	UpdateLastViewedScenarioDocument,
} from "../../../../graphql/generated"
import { css } from "../../../../styles/styled-system/css"

export const Route = createFileRoute(
	"/_auth/dashboard/simulation/$simulationId/scenario/$scenarioId",
)({
	component: RouteComponent,
	loader: async ({ params, context: { preloadQuery, apolloClient } }) => {
		// TODO: I'm not getting any data other than scenario ids and names
		// yet, but when I'm getting layers and whatnot, I will need this
		// to be another separate query.
		const simulationRef = preloadQuery(GetSimulationDocument, {
			variables: {
				simulationId: params.simulationId,
			},
		})

		const categoriesRef = preloadQuery(GetCategoriesDocument)

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
			simulationRef,
			categoriesRef,
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
	const { simulationRef, categoriesRef } = Route.useLoaderData()
	const { scenarioId, simulationId } = Route.useParams()
	const [updateLastViewedScenario] = useMutation(
		UpdateLastViewedScenarioDocument,
	)
	const [updateLastOpenedAt] = useMutation(UpdateLastOpenedAtDocument)
	const {
		data: { simulation },
	} = useReadQuery(simulationRef)
	const {
		data: { categories },
	} = useReadQuery(categoriesRef)

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

	useEffect(() => {
		updateLastOpenedAt({
			variables: {
				input: {
					simulationId,
				},
			},
		})
	}, [simulationId])

	return (
		<div className={css({ height: "100vh", overflow: "hidden" })}>
			{match(simulation)
				.with({ __typename: "Simulation" }, (simulation) => (
					<SimulationMapProvider
						simulation={simulation}
						categories={categories}
					>
						<SimulationMap />
					</SimulationMapProvider>
				))
				// TODO: Handle error cases.
				.otherwise(() => (
					<div>error</div>
				))}
		</div>
	)
}
