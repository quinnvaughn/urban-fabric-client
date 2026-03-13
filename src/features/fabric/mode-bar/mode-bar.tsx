import { Fragment } from "react/jsx-runtime"
import { Box, Typography } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { useFabricStore } from "../fabric-store"

export function ModeBar() {
	const activeTool = useFabricStore((state) => state.activeTool)
	const activeElement = useFabricStore((state) => state.activeElement)
	const selectedInstanceId = useFabricStore((state) => state.selectedInstanceId)
	const drawHint = useFabricStore((s) => s.drawHint)
	const hasActiveTarget = Boolean(activeElement || selectedInstanceId)

	const selectText = [
		"Select",
		"Click to select",
		"Drag to move",
		"Del to delete",
		"Dbl-click waypoint to remove segment",
	]

	if (!hasActiveTarget) {
		selectText.splice(1, 0, "E to select latest")
	}

	const drawText = [
		"Draw",
		"Click to place nodes",
		"Enter to finish",
		"Esc to cancel",
	]

	if (!hasActiveTarget) {
		drawText.splice(1, 0, "Pick element to start drawing")
	}

	const text: Record<typeof activeTool, string[]> = {
		select: selectText,
		draw: drawHint ?? drawText,
	}

	return (
		<Box
			className={css({
				borderRadius: "full",
				bg: "white",
				display: "flex",
				alignItems: "center",
				gap: "1.5",
				fontSize: "xs",
				color: "stone.600",
				pointerEvents: "none",
				whiteSpace: "nowrap",
				boxShadow: "sm",
				border: "1px solid",
				borderColor: "stone.200",
				py: "1.5",
				px: "3.5",
			})}
		>
			{activeTool &&
				text[activeTool].map((t, i, arr) => (
					<Fragment key={`${activeTool}-${t}`}>
						<Typography.Text
							size="xs"
							color={i === 0 ? "teal.700" : "stone.600"}
							weight={i === 0 ? "semibold" : "normal"}
						>
							{t}
						</Typography.Text>
						{i < arr.length - 1 && (
							<Box
								className={css({
									background: "stone.400",
									width: "3px",
									height: "3px",
									borderRadius: "full",
									flexShrink: 0,
								})}
							/>
						)}
					</Fragment>
				))}
		</Box>
	)
}
