import { HStack } from "../layout"
import { Typography } from "../typography"

type Props = {
	withText?: boolean
}

export function Logo({ withText = true }: Props) {
	return (
		<HStack align="center" gap="2">
			<img src="/logo.svg" alt="Urban Fabric" width={35} height={35} />
			{withText && (
				<Typography.Text size="sm" weight="bold" font={"sans"}>
					Urban Fabric
				</Typography.Text>
			)}
		</HStack>
	)
}
