import { match } from "ts-pattern"
import { useSimulationMapContext } from "../../../context"
import { DeleteSimulationDialog } from "../delete-simulation-dialog"
import { EditDetailsSheet } from "../edit-details-sheet"

export function SimulationOverlayRenderer() {
	const { activeOverlay } = useSimulationMapContext()

	return match(activeOverlay)
		.with("details", () => <EditDetailsSheet />)
		.with("delete", () => <DeleteSimulationDialog />)
		.otherwise(() => null)
}
