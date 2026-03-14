import { Box } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

export function Attribution() {
	return (
		<Box
			className={css({
				pointerEvents: "all",
				paddingBottom: "1",
				userSelect: "none",
				fontSize: "xs",
				color: "stone.500",
			})}
		>
			©{" "}
			<a
				href="https://www.openstreetmap.org/copyright"
				target="_blank"
				rel="noopener noreferrer"
				className={css({
					textDecoration: { base: "none", _hover: "underline" },
					color: { base: "stone.500", _hover: "stone.700" },
					fontSize: "xs",
					lineHeight: "none",
				})}
			>
				OpenStreetMap
			</a>
		</Box>
	)
}
