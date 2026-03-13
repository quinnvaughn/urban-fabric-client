import * as React from "react"
import { cx } from "@/styles/styled-system/css"
import { segmented as segmentedRecipe } from "@/styles/styled-system/recipes"

// ---------- Context ----------

interface SegmentedContextValue {
	value: string
	onSelect: (value: string) => void
	name: string
	size: "sm" | "md" | "lg"
	disabled?: boolean
	labelId: string
	slots: ReturnType<typeof segmentedRecipe>
}

const SegmentedContext = React.createContext<SegmentedContextValue | null>(null)

function useSegmentedContext() {
	const ctx = React.useContext(SegmentedContext)
	if (!ctx) {
		throw new Error(
			"Segmented sub-components must be used within <Segmented>",
		)
	}
	return ctx
}

// ---------- Root ----------

export interface SegmentedProps
	extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange"> {
	/** The currently selected value (controlled). */
	value?: string
	/** Default selected value (uncontrolled). */
	defaultValue?: string
	/** Radio group name. Generated automatically when omitted. */
	name?: string
	/** Called when a new option is selected. */
	onChange?: (value: string) => void
	size?: "sm" | "md" | "lg"
	/** Stretch to fill the available width, options share space equally. */
	fullWidth?: boolean
	/** Disables all options. */
	disabled?: boolean
}

function SegmentedRoot({
	value: valueProp,
	defaultValue,
	name,
	onChange,
	size = "md",
	fullWidth,
	disabled,
	className,
	children,
	...rest
}: SegmentedProps) {
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

	const slots = segmentedRecipe({ size, fullWidth })

	const ctx = React.useMemo(
		() => ({ value, onSelect, name: groupName, size, disabled, labelId, slots }),
		[value, onSelect, groupName, size, disabled, labelId, slots],
	)

	return (
		<SegmentedContext.Provider value={ctx}>
			<fieldset
				aria-labelledby={labelId}
				disabled={disabled}
				className={cx(slots.root, className)}
				{...rest}
			>
				{children}
			</fieldset>
		</SegmentedContext.Provider>
	)
}

// ---------- Legend ----------

function SegmentedLegend({
	className,
	children,
	...rest
}: React.HTMLAttributes<HTMLDivElement>) {
	const { slots, labelId } = useSegmentedContext()
	return (
		<div id={labelId} className={cx(slots.legend, className)} {...rest}>
			{children}
		</div>
	)
}
SegmentedLegend.displayName = "Segmented.Legend"

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
	/** Optional icon rendered above the label. */
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
	Group: SegmentedGroup,
	Option: SegmentedOption,
})
