import { Info, Trash, X } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import { useAnalytics } from "#/lib/analytics"
import { match, P } from "ts-pattern"
import {
	Box,
	Button,
	Input,
	Segmented,
	Select,
	Stepper,
	Textarea,
	Tooltip,
	Typography,
} from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { ELEMENT_TYPE_MAP } from "../element-types"
import type { PropertyDescriptor } from "../element-types/types"
import { useFabricStore } from "../fabric-store"
import { useCalculatedRows } from "../use-calculated-rows"

export function PropertiesPanel() {
	const {
		elements,
		selectedInstanceId,
		setSelectedInstanceId,
		updateElement,
		deleteElement,
	} = useFabricStore()
	const { capture } = useAnalytics()
	const selectedInstance =
		elements.find((e) => e.id === selectedInstanceId) ?? null

	const descriptor = selectedInstance
		? ELEMENT_TYPE_MAP[selectedInstance.typeId]
		: null

	const calculatedRows = useCalculatedRows(selectedInstance, descriptor ?? null)

	function renderComponent(prop: PropertyDescriptor) {
		const currentValue =
			(selectedInstance?.properties[prop.key] as string | undefined) ??
			String(prop.default)

		function handleChange(value: string) {
			if (!selectedInstance) return
			capture("editor_element_edited", {
				element_type: selectedInstance.typeId,
				property: prop.key,
			})
			updateElement(selectedInstance.id, {
				properties: { ...selectedInstance.properties, [prop.key]: value },
			})
		}

		const label = prop.description ? (
			<span
				className={css({
					display: "inline-flex",
					alignItems: "center",
					gap: "1",
				})}
			>
				{prop.label}
				<Tooltip>
					<Tooltip.Trigger>
						<span
							className={css({
								display: "inline-flex",
								color: "stone.400",
								cursor: "help",
							})}
						>
							<Info size={12} />
						</span>
					</Tooltip.Trigger>
					<Tooltip.Content side="top">{prop.description}</Tooltip.Content>
				</Tooltip>
			</span>
		) : (
			prop.label
		)

		return match(prop.input)
			.with({ kind: "segmented" }, (c) => (
				<Segmented
					key={prop.key}
					value={currentValue}
					onChange={handleChange}
					fullWidth
				>
					<Segmented.Legend>{label}</Segmented.Legend>
					<Segmented.Group>
						{c.options.map((o) => (
							<Segmented.Option
								key={o.value}
								value={o.value}
								icon={o.icon}
								title={o.description}
							>
								{o.label}
							</Segmented.Option>
						))}
					</Segmented.Group>
				</Segmented>
			))
			.with({ kind: "select" }, (select) => (
				<Select key={prop.key} value={currentValue} onChange={handleChange}>
					<Select.Label>{label}</Select.Label>
					<Select.Trigger />
					<Select.Options>
						{select.options.map((o) => (
							<Select.Option key={o.value} value={o.value}>
								{o.label}
							</Select.Option>
						))}
					</Select.Options>
				</Select>
			))
			.with({ kind: "stepper" }, (step) => {
				let min = step.min
				let max = step.max

				for (const constraint of prop.constraints ?? []) {
					const siblingVal = Number(
						selectedInstance?.properties[constraint.sibling],
					)
					if (Number.isFinite(siblingVal)) {
						if (constraint.kind === "max-sibling")
							max = Math.min(max, siblingVal - constraint.offset)
						if (constraint.kind === "min-sibling")
							min = Math.max(min, siblingVal + constraint.offset)
					}
				}

				return (
					<Stepper
						key={prop.key}
						size="md"
						value={Number(currentValue)}
						onChange={(val) => handleChange(String(val))}
						min={min}
						max={max}
						step={step.step}
						format={(val) => (step.unit ? `${val} ${step.unit}` : String(val))}
					>
						<Stepper.Label>{label}</Stepper.Label>
						<Stepper.Control />
					</Stepper>
				)
			})
			.with({ kind: "toggle" }, () => <div key={prop.key}>toggle</div>)
			.exhaustive()
	}

	return (
		<Box
			className={css({
				position: "fixed",
				top: "calc(var(--uf-header-height) + 20px)",
				right: "20px",
				width: "272px",
				zIndex: "panel",
				maxHeight: "calc(100vh - var(--uf-header-height) - 120px)",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
				background: "white",
				border: "1px solid",
				borderColor: "border.subtle",
				borderRadius: "lg",
				boxShadow: "md",
				animation: selectedInstance
					? "fadeInRight 0.42s var(--easings-spring) 0.12s both"
					: "none",
				opacity: selectedInstance ? 1 : 0,
				transform: selectedInstance ? "translateX(0)" : "translateX(20px)",
				transition: "opacity 0.42s, transform 200ms var(--easings-in-out)",
				pointerEvents: selectedInstance ? "auto" : "none",
			})}
		>
			{!descriptor || !selectedInstance ? null : (
				<Fragment>
					<Box
						className={css({
							display: "flex",
							alignItems: "center",
							justify: "between",
							px: "3.5",
							paddingTop: "3",
							paddingBottom: "2.5",
							borderBottom: "1px solid",
							borderBottomColor: "border.subtle",
							flexShrink: 0,
						})}
					>
						<Typography.Text
							size="xxs"
							weight="semibold"
							letterSpacing="wider"
							color="stone.500"
							transform="uppercase"
						>
							{descriptor.title}
						</Typography.Text>
						<Tooltip>
							<Tooltip.Trigger>
								<button
									type="button"
									onClick={() => setSelectedInstanceId(null)}
									className={css({
										width: "6",
										height: "6",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										border: "none",
										background: { base: "transparent", _hover: "stone.200" },
										borderRadius: "sm",
										color: { base: "stone.500", _hover: "stone.900" },
										cursor: "pointer",
										transition: "background 150ms, color 150ms",
									})}
								>
									<X size={12} />
								</button>
							</Tooltip.Trigger>
							<Tooltip.Content side="bottom">Close Esc</Tooltip.Content>
						</Tooltip>
					</Box>
					<Box
						className={css({
							flex: 1,
							overflowY: "auto",
							padding: "3.5",
							display: "flex",
							flexDirection: "column",
							gap: "3.5",
							scrollbarWidth: "thin",
							scrollbarColor: "stone.300 transparent",
						})}
					>
						<Input>
							<Input.Label>Title</Input.Label>
							<Input.Field
								placeholder={descriptor.title}
								value={selectedInstance.title ?? ""}
								onChange={(e) =>
									updateElement(selectedInstance.id, { title: e.target.value })
								}
							/>
						</Input>

						<Textarea>
							<Textarea.Label>Note</Textarea.Label>
							<Textarea.Field
								placeholder="Add a note…"
								value={selectedInstance.note ?? ""}
								minRows={2}
								maxRows={6}
								resize="none"
								onChange={(e) =>
									updateElement(selectedInstance.id, { note: e.target.value })
								}
							/>
						</Textarea>
						{match(descriptor.properties)
							.with([], () => (
								<Typography.Text
									size="sm"
									color="stone.500"
									className={css({ textAlign: "center" })}
								>
									No configurable properties
								</Typography.Text>
							))
							.with(P.array(P._), (props) =>
								props.map((val) => renderComponent(val)),
							)
							.exhaustive()}
					</Box>
					{calculatedRows.length > 0 && (
						<Box
							className={css({
								py: "2.5",
								px: "3.5",
								borderTop: "1px solid",
								borderTopColor: "border.subtle",
								display: "flex",
								flexDirection: "column",
								gap: "2",
								flexShrink: 0,
							})}
						>
							{calculatedRows.map((field) => (
								<Box
									key={field.key}
									className={css({
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										gap: "2",
									})}
								>
									<Typography.Text
										size="xs"
										color="stone.500"
										weight="semibold"
									>
										{field.label}
									</Typography.Text>
									<Typography.Text size="sm" color="stone.800" weight="medium">
										{field.value}
									</Typography.Text>
								</Box>
							))}
						</Box>
					)}
					<Box
						className={css({
							py: "3",
							px: "3.5",
							borderTop: "1px solid",
							borderTopColor: "border.subtle",
							flexShrink: 0,
						})}
					>
						<Button
							intent="danger"
							appearance="outline"
							fullWidth
							onClick={() => deleteElement(selectedInstance.id)}
						>
							<Trash size={14} />
							Remove
						</Button>
					</Box>
				</Fragment>
			)}
		</Box>
	)
}
