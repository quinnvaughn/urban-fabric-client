import { useMutation } from "@apollo/client/index.js"
import { redirect, useNavigate } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { useSimulationMapContext } from "../../../context"
import {
	CreateScenarioDocument,
	SimulationScenarioFragmentDoc,
} from "../../../graphql/generated"
import { useToast } from "../../../hooks"
import { css } from "../../../styles/styled-system/css"
import { ScenarioSelector } from "../scenario-selector"

export function ScenarioNav() {
	const { simulation } = useSimulationMapContext()
	const { addToast } = useToast()
	const [createScenario] = useMutation(CreateScenarioDocument)
	const navigate = useNavigate()

	async function handleCreateScenario() {
		const { data } = await createScenario({
			variables: {
				input: { simulationId: simulation.id },
			},
			update(cache, { data }) {
				const newScenario = data?.createScenario
				console.log("New scenario created:", newScenario)
				if (!newScenario) return

				cache.modify({
					id: cache.identify({ __typename: "Simulation", id: simulation.id }),
					fields: {
						scenarios(existing = []) {
							const newRef = cache.writeFragment({
								data: newScenario,
								fragment: SimulationScenarioFragmentDoc,
							})
							return [...existing, newRef]
						},
					},
				})
			},
		})

		return match(data?.createScenario)
			.with(
				{ __typename: "ForbiddenError" },
				{ __typename: "NotFoundError" },
				() => {
					redirect({ to: "/dashboard" })
				},
			)
			.with({ __typename: "UnauthorizedError" }, () => {
				redirect({ to: "/login" })
			})
			.with({ __typename: "Scenario" }, (scenario) => {
				navigate({
					to: "/dashboard/simulation/$simulationId/scenario/$scenarioId",
					params: { simulationId: simulation.id, scenarioId: scenario.id },
				})
			})
			.otherwise(() => {
				addToast({ message: "An unknown error occurred", intent: "danger" })
			})
	}

	return (
		<div
			className={css({
				display: "flex",
				px: "md",
				gap: "md",
				overflowX: "auto",
			})}
		>
			{simulation.scenarios.map((scenario) => (
				<ScenarioSelector key={scenario.id} scenario={scenario} />
			))}
			<button
				type="button"
				className={css({
					padding: "sm",
					borderRadius: "md",
					_hover: {
						backgroundColor: "neutral.100",
					},
					cursor: "pointer",
				})}
				onClick={handleCreateScenario}
			>
				<span className={css({ color: "neutral.900", textStyle: "xs" })}>
					+ Create Scenario
				</span>
			</button>
		</div>
	)
}
