import { Box, Logo, Typography } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Props = {
	title: string
}

export function EmbedProposalHeader({ title }: Props) {
	return (
		<Box
			as="header"
			className={css({
				height: "var(--uf-topbar-height)",
				background: "brand.default",
				gap: "2.5",
				display: "flex",
				alignItems: "center",
				px: "4",
			})}
		>
			<Logo onDark size="xl" />
			<Box
				className={css({
					height: "4.5",
					w: "px",
					background: "rgba(255, 255, 255, 0.25)",
				})}
			/>
			<Typography.Text
				size="sm"
				className={css({ color: "rgba(255,255,255,0.75)" })}
				truncate
			>
				{title}
			</Typography.Text>
		</Box>
	)
}
