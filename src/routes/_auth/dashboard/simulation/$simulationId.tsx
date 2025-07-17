import { createFileRoute } from "@tanstack/react-router"
import { FabricMap } from "../../../../features/ui"
import { css } from "../../../../styles/styled-system/css"

export const Route = createFileRoute(
	"/_auth/dashboard/simulation/$simulationId",
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div
			className={css({ height: "100vh", width: "100%", position: "relative" })}
		>
			<div
				className={css({
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					padding: "16px",
					backgroundColor: "neutral.100",
					zIndex: 1,
				})}
			>
				Header
			</div>
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
			</FabricMap>
		</div>
	)
}
