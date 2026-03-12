import { Box } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { MapControls } from "../map-controls"

export function EditorHUD() {
	return (
		<Box
			className={css({
				position: "fixed",
				bottom: "20px",
				left: "20px",
				right: "20px",
				zIndex: 100,
				pointerEvents: "none",
				display: "grid",
				gridTemplateColumns: "1fr auto 1fr",
				alignItems: "end",
				animation: "fadeUp 0.42s var(--easings-spring) 0.18s both",
			})}
		>
			<MapControls />
		</Box>
	)
}
