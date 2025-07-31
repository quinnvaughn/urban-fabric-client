import { useSimulationMapContext } from "../../../context"
import { SimulationOverlayRenderer } from "../simulation-overlay-renderer"

export function MapPageOverlays() {
	const { activeOverlay, setActiveOverlay, simulation } =
		useSimulationMapContext()
	return (
		<SimulationOverlayRenderer
			open={activeOverlay}
			onOpenChange={setActiveOverlay}
			simulation={simulation}
			showDescription
		/>
	)
}
