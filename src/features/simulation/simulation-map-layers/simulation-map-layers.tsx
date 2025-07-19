import { css } from "../../../styles/styled-system/css"

export function SimulationMapLayers() {
	return (
		<div
			className={css({
				boxShadow: "sm",
				bg: "neutral.0",
				position: "absolute",
				top: 69,
				p: "md",
				borderRadius: "md",
				left: 20,
			})}
		>
			Here is some content.
		</div>
	)
}
