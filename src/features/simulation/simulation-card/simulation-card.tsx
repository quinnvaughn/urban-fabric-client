import { useNavigate } from "@tanstack/react-router"
import type { SimulationCardFragment } from "../../../graphql/generated"
import { formatTimeAgo } from "../../../utils"
import { Card } from "../../ui"
import { SimulationDropdownMenu } from "../simulation-dropdown-menu"

type Props = {
	simulation: SimulationCardFragment
	onEdit: (e: React.MouseEvent) => void
	onDelete: (e: React.MouseEvent) => void
}

export function SimulationCard({ simulation, onEdit, onDelete }: Props) {
	const navigate = useNavigate()
	return (
		<Card
			role="button"
			tabIndex={0}
			onClick={() => {
				navigate({
					to: "/dashboard/simulation/$simulationId/scenario/$scenarioId",
					params: {
						simulationId: simulation.id,
						scenarioId: simulation.state.lastViewedScenarioId,
					},
				})
			}}
		>
			<Card.Header>
				<Card.Title>{simulation.name}</Card.Title>
				<Card.Action>
					<SimulationDropdownMenu onEdit={onEdit} onDelete={onDelete} />
				</Card.Action>
			</Card.Header>
			<Card.Content>
				<Card.Description>
					Last opened {formatTimeAgo(simulation.state.lastOpenedAt)}
				</Card.Description>
			</Card.Content>
		</Card>
	)
}
