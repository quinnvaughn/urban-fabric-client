import { Box } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Props = {
	children: React.ReactNode
}

export function DashboardContainer({ children }: Props) {
	return (
		<Box
			className={css({
				flex: 1,
				overflowY: "auto",
				paddingTop: "7",
				paddingBottom: "12",
				px: "7",
				animation: "fadeUp 0.5s var(--easings-spring) both",
			})}
		>
			{children}
		</Box>
	)
}
