import { FabricComposition } from "#/features/fabric"
import type { ElementInstance } from "#/features/fabric/element-types/types"
import { Divider, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Props = {
	description?: string | null
	elements: ElementInstance[]
	label?: string
	emptyDescriptionText?: string
	scrollable?: boolean
}

export function ProposalAboutTab({
	description,
	elements,
	label = "Description",
	emptyDescriptionText = "No description available",
	scrollable = true,
}: Props) {
	const hasDescription = Boolean(description && description.length > 0)

	return (
		<VStack
			gap="2.5"
			className={css({
				py: "4",
				px: "5",
				flex: 1,
				overflowY: scrollable ? "auto" : "visible",
			})}
		>
			<Divider label={label} />
			<Typography.Text
				color={hasDescription ? "stone.700" : "stone.400"}
				size="md"
				lineHeight="relaxed"
				weight={hasDescription ? "normal" : "medium"}
				fontStyle={hasDescription ? "normal" : "italic"}
				className={css({ whiteSpace: "pre-wrap" })}
			>
				{hasDescription ? description : emptyDescriptionText}
			</Typography.Text>
			<FabricComposition elements={elements} />
		</VStack>
	)
}
