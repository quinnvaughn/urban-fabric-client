import { match } from "ts-pattern"
import { useSimulationMapContext } from "../../../context"
import type { PropertiesSchema } from "../../../context/simulation-map/types"
import { css } from "../../../styles/styled-system/css"
import { capitalize } from "../../../utils"
import { Checkbox, Flex, Input, Select, Typography } from "../../ui"
import { IconButton } from "../../ui/icon-button"
import { FloatingPanel } from "../floating-panel"

function renderForm(
	propertiesSchema: PropertiesSchema,
	values: Record<string, any>,
	update: (key: string, value: any) => void,
) {
	return Object.entries(propertiesSchema).map(([key, schema]) => {
		return match(schema)
			.with({ type: "string", list: false }, () => (
				<Input
					label={schema.label}
					key={key}
					value={values[key] || ""}
					onChange={(e) => update(key, e.target.value)}
					onBlur={() => update(key, values[key])}
					error={null}
				/>
			))
			.with({ type: "boolean" }, () => (
				<Checkbox key={key}>
					<Checkbox.Input
						checked={values[key] || false}
						onChange={(e) => update(key, e.target.checked)}
					/>
					<Checkbox.Label>{schema.label}</Checkbox.Label>
				</Checkbox>
			))
			.with({ type: "enum" }, (schema) => (
				<Select
					key={key}
					value={values[key]}
					onChange={(value) => update(key, value)}
					className={css({ width: "180px" })}
				>
					<Select.Trigger>{schema.label}</Select.Trigger>
					<Select.Content>
						{schema.options.map((option) => (
							<Select.Item key={option} value={option}>
								{capitalize(option)}
							</Select.Item>
						))}
					</Select.Content>
				</Select>
			))
			.otherwise(() => null)
	})
}

export function LayerPropertiesPanel() {
	const { selectedTemplate, closePanel, currentProperties, updateProperty } =
		useSimulationMapContext()

	if (!selectedTemplate) {
		return null
	}

	return (
		<FloatingPanel top={90} right={12} width={300} maxHeightOffset={100}>
			<Flex direction="column" gap="md">
				<Flex direction="column" gap="sm">
					<Flex justify="between" align={"center"}>
						<Typography.Heading level={5}>
							{selectedTemplate.label}
						</Typography.Heading>
						<IconButton icon="X" size={16} onClick={() => closePanel()} />
					</Flex>
					<Typography.Text color="muted" textStyle="sm">
						{selectedTemplate.description}
					</Typography.Text>
				</Flex>
				<Flex direction={"column"} gap="sm">
					<Typography.Heading level={6}>Properties</Typography.Heading>
					<Flex direction="column" gap="xs">
						{renderForm(
							selectedTemplate.propertiesSchema,
							currentProperties as Record<string, any>,
							updateProperty,
						)}
					</Flex>
				</Flex>
			</Flex>
		</FloatingPanel>
	)
}
