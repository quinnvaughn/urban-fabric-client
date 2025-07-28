import { useMutation } from "@apollo/client/index.js"
import { useNavigate } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { useSimulationMapContext } from "../../../context"
import { DeleteScenarioDocument } from "../../../graphql/generated"
import { useToast } from "../../../hooks"
import { css } from "../../../styles/styled-system/css"
import { Button, Flex, Typography } from "../../ui"

type Props = {
	id: string
	onClose: () => void
}

export function DeleteScenario({ id, onClose }: Props) {
	const [deleteScenario] = useMutation(DeleteScenarioDocument)
	const { simulation } = useSimulationMapContext()
	const navigate = useNavigate()
	const { addToast } = useToast()
	async function handleDelete() {
		await deleteScenario({
			variables: {
				input: {
					id,
				},
			},
			update: (cache, { data }) => {
				if (!data?.deleteScenario) return
				match(data.deleteScenario)
					.with({ __typename: "ForbiddenError" }, () => {})
					.with({ __typename: "NotFoundError" }, () => {})
					.with({ __typename: "DeleteScenarioResponse" }, () => {
						// find current index of the scenario in the simulation
						const scenarioIndex = simulation.scenarios.findIndex(
							(scenario) => scenario.id === id,
						)
						if (scenarioIndex === -1) return
						// make sure previous scenario exists
						const previousScenario = simulation.scenarios[scenarioIndex - 1]
						if (!previousScenario) return
						cache.evict({
							id: cache.identify({
								__typename: "Scenario",
								id,
							}),
						})
						cache.modify({
							id: cache.identify({
								__typename: "Simulation",
								id,
							}),
							fields: {
								scenarios(existingScenarios = []) {
									return existingScenarios.filter(
										(scenario) => scenario.id !== id,
									)
								},
							},
						})
						addToast({
							message: "Scenario deleted successfully",
							intent: "success",
						})
						onClose()
						// redirect user to the previous scenario
						navigate({
							to: "/dashboard/simulation/$simulationId/scenario/$scenarioId",
							params: {
								simulationId: simulation.id,
								scenarioId: previousScenario.id,
							},
						})
					})
					.otherwise(() => {
						// handle unexpected cases
					})
			},
		})
	}

	return (
		<Flex
			className={css({ p: "md", maxWidth: "sm" })}
			direction={"column"}
			gap="sm"
		>
			<Typography.Heading level={6}>Delete Scenario</Typography.Heading>
			<Typography.Text color="muted" textStyle={"sm"}>
				Are you sure you want to delete this scenario? This action cannot be
				undone.
			</Typography.Text>
			<Flex justify={"end"} gap="sm">
				<Button variant="ghost" size="sm" intent="tertiary" onClick={onClose}>
					Cancel
				</Button>
				<Button
					variant="solid"
					size="sm"
					intent="danger"
					onClick={handleDelete}
				>
					Delete
				</Button>
			</Flex>
		</Flex>
	)
}
