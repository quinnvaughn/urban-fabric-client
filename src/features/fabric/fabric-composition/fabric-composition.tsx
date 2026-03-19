import { useMemo } from "react"
import {
	formatMiles,
	summarizeElementsByType,
	totalElementLengthMiles,
} from "#/features/fabric/element-metrics"
import { ELEMENT_TYPE_MAP } from "#/features/fabric/element-types"
import type { ElementInstance } from "#/features/fabric/element-types/types"
import { Divider, HStack, Swatch, Typography, VStack } from "#/features/ui"
import { singularOrPlural } from "#/lib/string"
import { css } from "#/styles/styled-system/css"

export function FabricComposition({
	elements,
}: {
	elements: ElementInstance[]
}) {
	const stats = useMemo(() => {
		const grouped = summarizeElementsByType(elements)
			.map((entry) => ({
				...entry,
				title: ELEMENT_TYPE_MAP[entry.typeId]?.title ?? "Unknown element",
				color: ELEMENT_TYPE_MAP[entry.typeId]?.baseMapStyle.color ?? "#a8a29e",
			}))
			.sort((a, b) => b.totalLengthMiles - a.totalLengthMiles)

		return {
			grouped,
			totalCount: elements.length,
			totalMiles: totalElementLengthMiles(elements),
		}
	}, [elements])

	return (
		<VStack gap="2.5" justify="start">
			<Divider label="What's in this fabric" />
			<VStack gap="0" justify="start">
				{stats.grouped.map((entry) => (
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
						<Typography.Text
							size="xs"
							color="stone.500"
							className={css({
								fontVariantNumeric: "tabular-nums",
								whiteSpace: "nowrap",
							})}
						>
							{`${entry.count} ${singularOrPlural("element", "elements", entry.count)} · ${formatMiles(entry.totalLengthMiles)}`}
						</Typography.Text>
					</HStack>
				))}
			</VStack>
			<HStack justify="space-between" align="center" gap="2">
				<Typography.Text
					size="xxs"
					color="stone.400"
					weight="semibold"
					transform="uppercase"
					letterSpacing="wider"
				>
					Total
				</Typography.Text>
				<Typography.Text size="sm" weight="semibold" color="stone.700">
					{`${stats.totalCount} ${singularOrPlural("element", "elements", stats.totalCount)} · ${formatMiles(stats.totalMiles)}`}
				</Typography.Text>
			</HStack>
		</VStack>
	)
}
