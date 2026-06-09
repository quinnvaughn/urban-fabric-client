import { ELEMENT_TYPE_MAP } from "#/features/fabric/element-types"
import { useCalculatedRows } from "#/features/fabric/use-calculated-rows"
import { Box, Divider, Typography, VStack } from "#/features/ui"
import { capitalize } from "#/lib/string"
import { css } from "#/styles/styled-system/css"
import { useProposalStore } from "../proposal-store"

export function ElementContent() {
	const { selectedInstance } = useProposalStore()
	const elementType = selectedInstance
		? ELEMENT_TYPE_MAP[selectedInstance.typeId]
		: null
	const calculatedRows = useCalculatedRows(selectedInstance ?? null, elementType ?? null)

	if (!selectedInstance) return null

	const propertyRows =
		elementType?.properties
			.filter((p) => p.showInProposal !== false)
			.map((p) => {
				const raw = selectedInstance.properties?.[p.key]
				if (raw == null) return null
				const unit = p.input.kind === "slider" ? p.input.unit : undefined
				const value = unit ? `${raw} ${unit}` : capitalize(String(raw))
				return { key: p.key, label: p.label, value }
			})
			.filter((r) => r != null) ?? []

	const allRows = [...propertyRows, ...calculatedRows]

	return (
		<VStack gap="3.5">
			{selectedInstance.title && (
				<Typography.Text size="lg" color="stone.900" weight="semibold">
					{selectedInstance.title}
				</Typography.Text>
			)}
			<VStack gap="2">
				<Divider label="Properties" />
				<div>
					{allRows.map((row) => (
						<Box
							key={row.key}
							className={css({
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								gap: "3",
								borderBottom: "1px solid",
								borderBottomColor: {
									base: "stone.100",
									_lastOfType: "transparent",
								},
								py: "2",
							})}
						>
							<Typography.Text size="sm" color="stone.500">
								{row.label}
							</Typography.Text>
							<Typography.Text
								size="sm"
								color="stone.900"
								textAlign="right"
								weight="medium"
							>
								{row.value as string}
							</Typography.Text>
						</Box>
					))}
				</div>
			</VStack>
			{selectedInstance.note ? (
				<VStack gap="2">
					<Divider label="Note" />
					<Typography.Text size="sm" color="stone.700" whiteSpace="pre-wrap">
						{selectedInstance.note}
					</Typography.Text>
				</VStack>
			) : (
				<Typography.Text
					size="sm"
					color="stone.400"
					fontStyle="italic"
					lineHeight="relaxed"
				>
					No note for this element.
				</Typography.Text>
			)}
		</VStack>
	)
}
