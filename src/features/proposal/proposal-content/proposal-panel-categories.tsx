import { Badge, HStack } from "#/features/ui"
import { enumValueToReadableLabel } from "#/lib/string"

export function ProposalPanelCategories({
	categories,
}: {
	categories: string[]
}) {
	if (categories.length === 0) return null

	return (
		<HStack gap="1" wrap>
			{categories.map((category) => (
				<Badge key={category} size="xs" tone="accent">
					{enumValueToReadableLabel(category)}
				</Badge>
			))}
		</HStack>
	)
}
