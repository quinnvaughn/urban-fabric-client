import { Info, Trash, X } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import { match, P } from "ts-pattern"
import {
	Box,
	Button,
	Input,
	Segmented,
	Select,
	Slider,
	Textarea,
	Tooltip,
	Typography,
} from "#/features/ui"
import { useAnalytics } from "#/lib/analytics"
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

			const newNumVal = Number(value)
			const updatedProperties: Record<string, unknown> = {
				...selectedInstance.properties,
				[prop.key]: value,
			}

			// Clamp sibling values that now violate their max-sibling constraint
			for (const otherProp of descriptor?.properties ?? []) {
				if (otherProp.key === prop.key) continue
				for (const constraint of otherProp.constraints ?? []) {
					if (constraint.sibling !== prop.key) continue
					const siblingCurrentVal = Number(
						updatedProperties[otherProp.key] ?? otherProp.default,
					)
					if (!Number.isFinite(siblingCurrentVal)) continue
					if (constraint.kind === "max-sibling") {
						const newMax = newNumVal - constraint.offset
						if (siblingCurrentVal > newMax) {
							updatedProperties[otherProp.key] = String(newMax)
						}
					}
				}
			}

			updateElement(selectedInstance.id, { properties: updatedProperties })
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
				<Tooltip placement="top-end">
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
					<Tooltip.Content>{prop.description}</Tooltip.Content>
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
						{c.options.map((o) =>
							o.description ? (
								<Tooltip key={o.value} placement="top-end" delayMs={500}>
									<Tooltip.Trigger>
										<Segmented.Option
											value={o.value}
											icon={o.icon}
											aria-label={`${o.label}: ${o.description}`}
										>
											{o.label}
										</Segmented.Option>
									</Tooltip.Trigger>
									<Tooltip.Content>{o.description}</Tooltip.Content>
								</Tooltip>
							) : (
								<Segmented.Option
									key={o.value}
									value={o.value}
									icon={o.icon}
									aria-label={o.label}
								>
									{o.label}
								</Segmented.Option>
							),
						)}
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
			.with({ kind: "slider" }, (step) => {
				let softMax: number | undefined
				let softMin: number | undefined

				for (const constraint of prop.constraints ?? []) {
					const siblingVal = Number(
						selectedInstance?.properties[constraint.sibling] ??
							descriptor?.properties.find(
								(p) => p.key === constraint.sibling,
							)?.default,
					)
					if (!Number.isFinite(siblingVal)) continue
					if (constraint.kind === "max-sibling") {
						const limit = siblingVal - constraint.offset
						softMax = softMax === undefined ? limit : Math.min(softMax, limit)
					}
					if (constraint.kind === "min-sibling") {
						const limit = siblingVal + constraint.offset
						softMin = softMin === undefined ? limit : Math.max(softMin, limit)
					}
				}

				function handleSliderChange(val: number) {
					let clamped = val
					if (softMax !== undefined) clamped = Math.min(clamped, softMax)
					if (softMin !== undefined) clamped = Math.max(clamped, softMin)
					if (clamped === Number(currentValue)) return
					handleChange(String(clamped))
				}

				return (
					<Slider
						key={prop.key}
						value={Number(currentValue)}
						onValueChange={handleSliderChange}
						min={step.min}
						max={step.max}
						softMax={softMax}
						softMin={softMin}
						step={step.step}
						formatValue={(val) =>
							step.unit ? `${val} ${step.unit}` : String(val)
						}
					>
						<Slider.Header>
							<Slider.Label>{label}</Slider.Label>
							<Slider.Value />
						</Slider.Header>
						<Slider.Track />
						<Slider.Bounds />
						{prop.constraints?.map((constraint) => {
							const siblingLabel = descriptor?.properties.find(
								(p) => p.key === constraint.sibling,
							)?.label
							if (!siblingLabel) return null
							const hint =
								constraint.kind === "max-sibling"
									? `Must be less than ${siblingLabel}`
									: `Must be greater than ${siblingLabel}`
							return (
								<Slider.Description key={constraint.sibling}>
									{hint}
								</Slider.Description>
							)
						})}
					</Slider>
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
						<Tooltip placement="bottom-end">
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
							<Tooltip.Content>Close Esc</Tooltip.Content>
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
