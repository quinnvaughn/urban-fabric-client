import { Avatar, HStack, Typography } from "#/features/ui"

export function ProposalPanelAuthor({ name }: { name: string }) {
	return (
		<HStack align="center" gap="2" wrap>
			<Avatar size="xs" name={name} />
			<Typography.Text size="sm" color="stone.700" weight="medium">
				{name}
			</Typography.Text>
		</HStack>
	)
}
