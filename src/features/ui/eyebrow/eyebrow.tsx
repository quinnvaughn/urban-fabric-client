import type React from "react"
import type { ComponentProps } from "react"
import { Typography } from "../typography"

type Props = {
	children: React.ReactNode
	color?: ComponentProps<typeof Typography.Text>["color"]
	size?: ComponentProps<typeof Typography.Text>["size"]
}

export function Eyebrow({ children, color = "coral.500", size }: Props) {
	return (
		<Typography.Text
			size={size}
			weight="semibold"
			color={color}
			transform="uppercase"
			letterSpacing="wider"
		>
			{children}
		</Typography.Text>
	)
}
