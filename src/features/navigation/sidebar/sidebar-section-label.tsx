import { Box, Typography } from "#/features/ui"

type Props = {
	children: React.ReactNode
}

export function SidebarSectionLabel({ children }: Props) {
	return (
		<Box
			sx={{
				paddingTop: "2.5",
				paddingInline: "2.5",
				paddingBottom: "1",
			}}
		>
			<Typography.Text
				size="xs"
				weight="semibold"
				color="stone.400"
				font="sans"
				transform="uppercase"
				lineHeight="tight"
			>
				{children}
			</Typography.Text>
		</Box>
	)
}
