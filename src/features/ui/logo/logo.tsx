import type { ComponentProps } from "react"
import { HStack } from "../layout"
import { Typography } from "../typography"

type Props = {
	withText?: boolean
	onDark?: boolean
	size?: ComponentProps<typeof Typography.Text>["size"]
}

export function Logo({ withText = true, onDark = false, size = "sm" }: Props) {
	return (
		<HStack align="center" gap="2">
			<img src="/logo.svg" alt="Urban Fabric" width={35} height={35} />
			{withText && (
				<Typography.Text
					color={onDark ? "white" : "stone.900"}
					size={size}
					weight="bold"
					font={"sans"}
				>
					Urban Fabric
				</Typography.Text>
			)}
		</HStack>
	)
}
