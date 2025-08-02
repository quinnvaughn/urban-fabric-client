import { FabricMap } from "../../ui"
import {
	LayerPropertiesPanel,
	MapPageOverlays,
	SimulationMapFooter,
	SimulationMapHeader,
	SimulationMapLayers,
	useTemplateInteraction,
} from ".."

function SimulationMapRuntime() {
	useTemplateInteraction()
	return (
		<>
			<MapPageOverlays />
			<SimulationMapHeader />
			<SimulationMapLayers />
			<LayerPropertiesPanel />
			<SimulationMapFooter />
		</>
	)
}

export function SimulationMap() {
	return (
		<FabricMap>
			<FabricMap.Layer
				id="3d-buildings"
				source="composite"
				source-layer="building"
				type="fill-extrusion"
				filter={["==", ["get", "extrude"], "true"]}
				paint={{
					"fill-extrusion-color": "#aaa",
					"fill-extrusion-height": ["get", "height"],
					"fill-extrusion-base": ["get", "min_height"],
					"fill-extrusion-opacity": 0.6,
				}}
			/>
			<SimulationMapRuntime />
		</FabricMap>
	)
}
