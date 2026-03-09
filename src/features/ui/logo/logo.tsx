import { HStack } from "../layout"
import { Typography } from "../typography"

export function Logo() {
	return (
		<HStack align="center" gap="2">
			<img src="/logo.svg" alt="Urban Fabric" width={24} height={24} />
			<Typography.Text size="sm" weight="bold" font={"sans"}>
				Urban Fabric
			</Typography.Text>
		</HStack>
	)
}
