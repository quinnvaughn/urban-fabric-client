import { useReadQuery } from "@apollo/client/index.js"
import { createFileRoute } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { SimulationContextMenu } from "../../../../features/simulation"
import { Card, Flex, Grid, Typography } from "../../../../features/ui"
import { UserSimulationsDocument } from "../../../../graphql/generated"
import { css } from "../../../../styles/styled-system/css"
import { formatTimeAgo, truncate } from "../../../../utils"

export const Route = createFileRoute("/_auth/dashboard/_shell/")({
	component: DashboardPage,
	loader: ({ context: { preloadQuery } }) => {
		const queryRef = preloadQuery(UserSimulationsDocument)
		return {
			queryRef,
		}
	},
})

function DashboardPage() {
	const { queryRef } = Route.useLoaderData()
	const { data } = useReadQuery(queryRef)
	const simulations = data.currentUser?.simulations || []
	const navigate = Route.useNavigate()
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
								// biome-ignore lint/a11y/useSemanticElements: ignored
								<Card
									key={simulation.id}
									role="button"
									tabIndex={0}
									onClick={() => {
										navigate({
											to: "/dashboard/simulation/$simulationId",
											params: { simulationId: simulation.id },
										})
									}}
								>
									<Card.Header>
										<Card.Title>{simulation.name}</Card.Title>

										{simulation.description && (
											<Card.Description>
												{truncate(simulation.description, 120)}
											</Card.Description>
										)}
										<Card.Action>
											<SimulationContextMenu id={simulation.id} />
										</Card.Action>
									</Card.Header>
									<Card.Footer className={css({ alignItems: "flex-start" })}>
										<Typography.Text color="muted" textStyle={"sm"}>
											Last edited {formatTimeAgo(simulation.updatedAt)}
										</Typography.Text>
									</Card.Footer>
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
	)
}
