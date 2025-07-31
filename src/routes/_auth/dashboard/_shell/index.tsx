import { useReadQuery } from "@apollo/client/index.js"
import { createFileRoute } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { SimulationCard } from "../../../../features/simulation"
import { Flex, Grid, Typography } from "../../../../features/ui"
import { UserSimulationsDocument } from "../../../../graphql/generated"
export const Route = createFileRoute("/_auth/dashboard/_shell/")({
	component: DashboardPage,
	loader: ({ context: { preloadQuery } }) => {
		const queryRef = preloadQuery(UserSimulationsDocument)
		return {
			queryRef,
		}
	},
	head: () => ({
		meta: [
			{
				name: "description",
				content: "Your dashboard for managing simulations",
			},
			{
				title: "Dashboard - Urban Fabric",
			},
		],
	}),
})

function DashboardPage() {
	const { queryRef } = Route.useLoaderData()
	const { data } = useReadQuery(queryRef)
	const simulations = data.currentUser?.simulations || []
	return (
		<Flex direction="column" gap="lg">
			<Typography.Heading level={1}>Dashboard</Typography.Heading>

			{match(simulations)
				.when(
					(simulations) => simulations.length > 0,
					(simulations) => (
						<Grid
							gap="md"
							templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
						>
							{simulations.map((simulation) => (
								<SimulationCard key={simulation.id} simulation={simulation} />
							))}
						</Grid>
					),
				)
				.otherwise(() => (
					<Typography.Text color="muted">
						You have no simulations yet. Create one to get started.
					</Typography.Text>
				))}
		</Flex>
	)
}
