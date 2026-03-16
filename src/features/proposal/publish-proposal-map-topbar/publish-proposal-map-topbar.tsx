import { Box, Typography } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

export function PublishProposalMapTopbar() {
	return (
		<Box
			className={css({
				position: "absolute",
				top: "20px",
				left: "50%",
				transform: "translateX(-50%)",
				zIndex: "panel",
				gap: "1.5",
				px: "4",
				py: "2",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				border: "1px solid",
				borderColor: "stone.200",
				borderRadius: "full",
				whiteSpace: "nowrap",
				pointerEvents: "all",
				boxShadow: "sm",
				background: "white",
			})}
		>
			<Typography.Text size="xs" weight="semibold" color="stone.900">
				Set proposal map view
			</Typography.Text>
			<Typography.Text size="xxs" color="stone.500">
				— pan & zoom to your preferred starting view
			</Typography.Text>
		</Box>
	)
}
