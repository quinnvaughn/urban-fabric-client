import { match } from "ts-pattern"
import { useSimulationMapContext } from "../../../context"
import { EditDetailsSheet } from "../edit-details-sheet"

export function SimulationOverlayRenderer() {
	const { activeOverlay } = useSimulationMapContext()

	return match(activeOverlay)
		.with("details", () => <EditDetailsSheet />)
		.with("delete", () => (
			<div>
				{/* Render Delete Modal */}
				<h2>Delete Simulation</h2>
				{/* Add confirmation dialog for deletion */}
			</div>
		))
		.otherwise(() => null)
}
