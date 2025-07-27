import { useReadQuery } from "@apollo/client/index.js";
import { createFileRoute } from "@tanstack/react-router";
import { match } from "ts-pattern";
import { SimulationDropdownMenu } from "../../../../features/simulation";
import { Card, Flex, Grid, Typography } from "../../../../features/ui";
import { UserSimulationsDocument } from "../../../../graphql/generated";
import { formatTimeAgo } from "../../../../utils";

export const Route = createFileRoute("/_auth/dashboard/_shell/")({
	component: DashboardPage,
	loader: ({ context: { preloadQuery } }) => {
		const queryRef = preloadQuery(UserSimulationsDocument);
		return {
			queryRef,
		};
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
});

function DashboardPage() {
	const { queryRef } = Route.useLoaderData();
	const { data } = useReadQuery(queryRef);
	const simulations = data.currentUser?.simulations || [];
	const navigate = Route.useNavigate();
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
								<Card
									key={simulation.id}
									role="button"
									tabIndex={0}
									onClick={() => {
										navigate({
											to: "/dashboard/simulation/$simulationId/scenario/$scenarioId",
											params: {
												simulationId: simulation.id,
												scenarioId: simulation.state.lastViewedScenarioId,
											},
										});
									}}
								>
									<Card.Header>
										<Card.Title>{simulation.name}</Card.Title>
										<Card.Action>
											<SimulationDropdownMenu id={simulation.id} />
										</Card.Action>
									</Card.Header>
									<Card.Content>
										<Card.Description>
											Last opened {formatTimeAgo(simulation.state.lastOpenedAt)}
										</Card.Description>
									</Card.Content>
								</Card>
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
	);
}
