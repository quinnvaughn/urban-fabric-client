import { useMemo } from "react"
import { summarizeElementsByType } from "#/features/fabric/element-metrics"
import { ELEMENT_TYPE_MAP } from "#/features/fabric/element-types"
import type { ElementInstance } from "#/features/fabric/element-types/types"
import {
	Button,
	HStack,
	Swatch,
	Toggle,
	Typography,
	VStack,
} from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { useProposalStore } from "../proposal-store"

type Props = {
	elements: ElementInstance[]
	scrollable?: boolean
}

export function ProposalLayersTab({ elements, scrollable = true }: Props) {
	const { hiddenTypeIds, toggleTypeVisibility, setTypesVisibility } =
		useProposalStore()
	const sortedElements = useMemo(() => {
		const knownElements = elements.filter((e) => ELEMENT_TYPE_MAP[e.typeId])

		return summarizeElementsByType(knownElements)
			.map((entry) => ({
				...entry,
				title: ELEMENT_TYPE_MAP[entry.typeId].title,
				color: ELEMENT_TYPE_MAP[entry.typeId].baseMapStyle.color,
			}))
			.sort((a, b) => b.totalLengthMiles - a.totalLengthMiles)
	}, [elements])
	const visibleCount = sortedElements.filter(
		(entry) => !hiddenTypeIds.includes(entry.typeId),
	).length
	const totalCount = sortedElements.length
	const areAllVisible = totalCount > 0 && visibleCount === totalCount
	const bulkButtonLabel = areAllVisible ? "Hide all" : "Show all"

	function handleBulkToggle() {
		const typeIds = sortedElements.map((entry) => entry.typeId)
		setTypesVisibility(typeIds, !areAllVisible)
	}

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
			<HStack justify="end" fullWidth>
				<Button
					type="button"
					appearance="ghost"
					intent="neutral"
					onClick={handleBulkToggle}
				>
					{bulkButtonLabel}
				</Button>
			</HStack>
			{sortedElements.map((entry) => (
				<HStack
					key={entry.typeId}
					justify="space-between"
					align="center"
					gap="2"
					className={css({
						borderBottom: "1px solid",
						borderBottomColor: {
							base: "stone.200",
							_lastOfType: "transparent",
						},
						py: "2",
					})}
				>
					<Swatch size="2.5" color={entry.color} />
					<Typography.Text
						size="sm"
						color="stone.800"
						weight="medium"
						className={css({ flex: 1 })}
					>
						{entry.title}
					</Typography.Text>
					<Toggle
						checked={!hiddenTypeIds.includes(entry.typeId)}
						onCheckedChange={() => toggleTypeVisibility(entry.typeId)}
					/>
				</HStack>
			))}
		</VStack>
	)
}
