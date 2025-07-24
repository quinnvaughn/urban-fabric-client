import { createFileRoute, redirect } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { GetSimulationDocument } from "../../../../graphql/generated"

export const Route = createFileRoute(
	"/_auth/dashboard/simulation/$simulationId/",
)({
	component: RouteComponent,
	beforeLoad: async ({
		context: { apolloClient },
		params: { simulationId },
	}) => {
		const { data } = await apolloClient.query({
			query: GetSimulationDocument,
			variables: { simulationId },
		})
		return match(data.simulation)
			.with({ __typename: "Simulation" }, (sim) => {
				return redirect({
					to: "/dashboard/simulation/$simulationId/scenario/$scenarioId",
					params: {
						simulationId: sim.id,
						scenarioId: sim.state.lastViewedScenarioId,
					},
					replace: true,
				})
			})
			.with(
				{ __typename: "ForbiddenError" },
				{ __typename: "NotFoundError" },
				() => {
					return redirect({
						to: "/dashboard",
						replace: true,
					})
				},
			)
			.with({ __typename: "UnauthorizedError" }, () => {
				return redirect({
					to: "/login",
					replace: true,
				})
			})
			.otherwise(() => {})
	},
})

function RouteComponent() {
	return <div>Hello "/_auth/dashboard/simulation/$simulationId/"!</div>
}
