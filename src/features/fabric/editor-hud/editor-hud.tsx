import { Box } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { Attribution } from "../attribution"
import { MapControls } from "../map-controls"

type Props = {
	is3DMode?: boolean
	onToggle3DMode?: () => void
}

export function EditorHUD({ is3DMode, onToggle3DMode }: Props) {
	return (
		<Box
			className={css({
				position: "fixed",
				bottom: "20px",
				left: "20px",
				right: "20px",
				zIndex: "panel",
				pointerEvents: "none",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "end",
				animation: "fadeUp 0.42s var(--easings-spring) 0.18s both",
			})}
		>
			<Attribution />
			<MapControls is3DMode={is3DMode} onToggle3DMode={onToggle3DMode} />
		</Box>
	)
}
