import { Fragment } from "react/jsx-runtime"
import { Box, Typography } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { useFabricStore } from "../fabric-store"

const text = {
	select: ["Select", "Click to select", "Drag to Move", "Del to remove"],
	draw: ["Draw", "Click to place nodes", "Enter to finish", "Esc to cancel"],
}

export function ModeBar() {
	const activeTool = useFabricStore((state) => state.activeTool)
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
					<Fragment key={t}>
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
