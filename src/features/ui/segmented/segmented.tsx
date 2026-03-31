import * as React from "react"
import { cx } from "@/styles/styled-system/css"
import type { SegmentedVariantProps } from "@/styles/styled-system/recipes"
import { segmented as segmentedRecipe } from "@/styles/styled-system/recipes"
import { FieldDescription, FieldLabel } from "../field"

// ---------- Context ----------

interface SegmentedContextValue {
	value: string
	onSelect: (value: string) => void
	name: string
	disabled?: boolean
	labelId: string
	slots: ReturnType<typeof segmentedRecipe>
}

const SegmentedContext = React.createContext<SegmentedContextValue | null>(null)

function useSegmentedContext() {
	const ctx = React.useContext(SegmentedContext)
	if (!ctx) {
		throw new Error("Segmented sub-components must be used within <Segmented>")
	}
	return ctx
}

// ---------- Root ----------

export interface SegmentedProps
	extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange">,
		SegmentedVariantProps {
	/** The currently selected value (controlled). */
	value?: string
	/** Default selected value (uncontrolled). */
	defaultValue?: string
	/** Radio group name. Generated automatically when omitted. */
	name?: string
	/** Called when a new option is selected. */
	onChange?: (value: string) => void
	/** Disables all options. */
	disabled?: boolean
}

function SegmentedRoot({
	value: valueProp,
	defaultValue,
	name,
	onChange,
	disabled,
	className,
	children,
	...rest
}: SegmentedProps) {
	const [variantProps, fieldsetProps] = segmentedRecipe.splitVariantProps(rest)
	const slots = segmentedRecipe(variantProps)

	const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
	const generatedName = React.useId()
	const labelId = React.useId()

	const isControlled = valueProp !== undefined
	const value = isControlled ? valueProp : internalValue
	const groupName = name ?? generatedName

	const onSelect = React.useCallback(
		(next: string) => {
			if (!isControlled) setInternalValue(next)
			onChange?.(next)
		},
		[isControlled, onChange],
	)

	const ctx = React.useMemo(
		() => ({ value, onSelect, name: groupName, disabled, labelId, slots }),
		[value, onSelect, groupName, disabled, labelId, slots],
	)

	return (
		<SegmentedContext.Provider value={ctx}>
			<fieldset
				aria-labelledby={labelId}
				disabled={disabled}
				className={cx(slots.root, className)}
				{...fieldsetProps}
			>
				{children}
			</fieldset>
		</SegmentedContext.Provider>
	)
}
SegmentedRoot.displayName = "Segmented"

// ---------- Legend ----------

function SegmentedLegend({
	children,
	...rest
}: Omit<React.HTMLAttributes<HTMLDivElement>, "color">) {
	const { labelId } = useSegmentedContext()
	return (
		<FieldLabel as="div" id={labelId} {...rest}>
			{children}
		</FieldLabel>
	)
}
SegmentedLegend.displayName = "Segmented.Legend"

// ---------- Description ----------

export interface SegmentedDescriptionProps
	extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color"> {}

function SegmentedDescription({ ...rest }: SegmentedDescriptionProps) {
	return <FieldDescription {...rest} />
}
SegmentedDescription.displayName = "Segmented.Description"

// ---------- Group ----------

function SegmentedGroup({
	className,
	children,
	...rest
}: React.HTMLAttributes<HTMLDivElement>) {
	const { slots } = useSegmentedContext()
	return (
		<div className={cx(slots.group, className)} {...rest}>
			{children}
		</div>
	)
}
SegmentedGroup.displayName = "Segmented.Group"

// ---------- Option ----------

export interface SegmentedOptionProps
	extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
	value: string
	/** Optional icon rendered above or beside the label. */
	icon?: React.ReactNode
	disabled?: boolean
}

function SegmentedOption({
	value,
	icon,
	className,
	disabled: disabledProp,
	children,
	...rest
}: SegmentedOptionProps) {
	const {
		value: selectedValue,
		onSelect,
		name,
		disabled: groupDisabled,
		slots,
	} = useSegmentedContext()

	const isSelected = value === selectedValue
	const isDisabled = disabledProp || groupDisabled

	return (
		<label
			data-selected={isSelected ? "" : undefined}
			data-disabled={isDisabled ? "" : undefined}
			className={cx(slots.option, className)}
			{...rest}
		>
			<input
				type="radio"
				name={name}
				checked={isSelected}
				disabled={isDisabled}
				onChange={() => onSelect(value)}
				style={{
					position: "absolute",
					opacity: 0,
					width: 1,
					height: 1,
					pointerEvents: "none",
				}}
			/>
			{icon && <span className={slots.optionIcon}>{icon}</span>}
			{children && <span className={slots.optionLabel}>{children}</span>}
		</label>
	)
}
SegmentedOption.displayName = "Segmented.Option"

// ---------- Dot-notation export ----------

export const Segmented = Object.assign(SegmentedRoot, {
	Legend: SegmentedLegend,
	Description: SegmentedDescription,
	Group: SegmentedGroup,
	Option: SegmentedOption,
})
