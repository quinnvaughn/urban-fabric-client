import { X } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import { ELEMENT_TYPE_MAP } from "#/features/fabric/element-types"
import type { ElementInstance } from "#/features/fabric/element-types/types"
import { useCalculatedRows } from "#/features/fabric/use-calculated-rows"
import {
	Box,
	Button,
	Divider,
	HStack,
	Swatch,
	Typography,
	VStack,
} from "#/features/ui"
import { capitalize } from "#/lib/string"
import { css } from "#/styles/styled-system/css"

type Props = {
	instance: ElementInstance
	onClose: () => void
}

export function SelectedInstancePanel({ instance, onClose }: Props) {
	const elementType = ELEMENT_TYPE_MAP[instance.typeId]
	const calculatedRows = useCalculatedRows(instance, elementType ?? null)

	const propertyRows =
		elementType?.properties
			.map((p) => {
				const raw = instance.properties?.[p.key]
				if (raw == null) return null
				const unit = p.input.kind === "slider" ? p.input.unit : undefined
				const value = unit ? `${raw} ${unit}` : capitalize(String(raw))
				return { key: p.key, label: p.label, value }
			})
			.filter((r) => r != null) ?? []

	const allRows = [...propertyRows, ...calculatedRows]

	return (
		<Fragment>
			<Box
				className={css({
					p: "4",
					flexShrink: 0,
					display: "flex",
					alignItems: "flex-start",
					gap: "2.5",
					borderBottom: "1px solid",
					borderBottomColor: "stone.200",
				})}
			>
				<VStack gap="1" className={css({ flex: 1 })}>
					<Typography.Text
						size="xxs"
						color="coral.500"
						weight="semibold"
						transform="uppercase"
						letterSpacing="wider"
					>
						Element
					</Typography.Text>
					<HStack gap="2">
						<Swatch size="3" color={elementType?.baseMapStyle.color} />
						<Typography.Text size="md" color="stone.900" weight="semibold">
							{elementType?.title}
						</Typography.Text>
					</HStack>
				</VStack>
				<Button appearance="ghost" intent="neutral" size="xs" onClick={onClose}>
					<X size={14} />
				</Button>
			</Box>
			<Box
				className={css({
					flex: 1,
					overflowY: "auto",
					p: "4",
				})}
			>
				<VStack gap="3.5">
					{instance.title && (
						<Typography.Text size="lg" color="stone.900" weight="semibold">
							{instance.title}
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
					{instance.note ? (
						<VStack gap="2">
							<Divider label="Note" />
							<Typography.Text
								size="sm"
								color="stone.700"
								whiteSpace="pre-wrap"
							>
								{instance.note}
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
			</Box>
		</Fragment>
	)
}
