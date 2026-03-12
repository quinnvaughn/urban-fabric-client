import { Box } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

export function Attribution() {
	return (
		<Box
			className={css({
				justifySelf: "end",
				borderRadius: "md",
				fontSize: "xs",
				color: "stone.500",
				fontWeight: "medium",
				whiteSpace: "nowrap",
				pointerEvents: "all",
				boxShadow: "sm",
				background: "white",
				border: "1px solid",
				borderColor: "stone.200",
				px: "3",
				py: "1",
			})}
		>
			<a
				href="https://www.openstreetmap.org/copyright"
				target="_blank"
				rel="noopener noreferrer"
			>
				© OpenStreetMap
			</a>
		</Box>
	)
}
