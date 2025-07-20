import { match } from "ts-pattern"
import { useSimulationMapContext } from "../../../context"
import type { PropertiesSchema } from "../../../context/simulation-map/types"
import { capitalize } from "../../../utils"
import { Checkbox, Input, Select } from "../../ui"
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
					options={schema.options.map((option) => ({
						value: option,
						label: capitalize(option),
					}))}
					value={values[key]}
					onChange={(value) => update(key, value)}
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
		<FloatingPanel top={60} right={20} width={300} maxHeightOffset={100}>
			<FloatingPanel.Header>
				<FloatingPanel.Title>{selectedTemplate.label}</FloatingPanel.Title>
				<FloatingPanel.Description>
					{selectedTemplate.description}
				</FloatingPanel.Description>
				<FloatingPanel.Action>
					<IconButton icon="X" size={16} onClick={() => closePanel()} />
				</FloatingPanel.Action>
			</FloatingPanel.Header>
			<FloatingPanel.Content>
				<FloatingPanel.Title level={6}>Properties</FloatingPanel.Title>
				{renderForm(
					selectedTemplate.propertiesSchema,
					currentProperties as Record<string, any>,
					updateProperty,
				)}
			</FloatingPanel.Content>
		</FloatingPanel>
	)
}
