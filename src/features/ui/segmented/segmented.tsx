import * as React from "react"
import { cx, sva } from "@/styles/styled-system/css"
import { FieldDescription, FieldLabel } from "../field"

export const segmented = sva({
	className: "segmented",
	slots: ["root", "group", "option", "optionIcon", "optionLabel"],
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			gap: "1",
		},
		group: {
			display: "flex",
			gap: "1",
		},
		option: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			gap: "0.5",
			flex: "1",
			borderRadius: "md",
			borderWidth: "1",
			borderStyle: "solid",
			borderColor: "border.default",
			bg: "bg.subtle",
			fontFamily: "sans",
			fontWeight: "medium",
			color: "fg.muted",
			cursor: "pointer",
			userSelect: "none",
			transition: "all 150ms ease",
			_hover: {
				bg: "bg.muted",
				borderColor: "border.strong",
				color: "fg.default",
			},
			"&[data-selected]": {
				bg: "brand.subtle",
				borderColor: "brand.muted",
				color: "brand.emphasis",
			},
			_disabled: {
				opacity: "50",
				cursor: "not-allowed",
				_hover: {
					bg: "bg.subtle",
					borderColor: "border.default",
					color: "fg.muted",
				},
			},
			"&[data-disabled]": {
				opacity: "50",
				cursor: "not-allowed",
				_hover: {
					bg: "bg.subtle",
					borderColor: "border.default",
					color: "fg.muted",
				},
			},
			"&[data-selected][disabled], &[data-selected][data-disabled]": {
				bg: "brand.subtle",
				borderColor: "brand.muted",
				color: "brand.emphasis",
			},
			"&[data-selected]:hover": {
				bg: "brand.subtle",
				borderColor: "brand.muted",
				color: "brand.emphasis",
			},
		},
		optionIcon: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			lineHeight: "none",
		},
		optionLabel: {
			lineHeight: "none",
			textAlign: "center",
		},
	},
	variants: {
		size: {
			sm: {
				option: {
					py: "1.5",
					px: "2",
					fontSize: "xs",
					minH: "8",
				},
				optionIcon: { fontSize: "sm" },
				optionLabel: { fontSize: "xs" },
			},
			md: {
				option: {
					py: "1.5",
					px: "3",
					fontSize: "sm",
					minH: "9",
				},
				optionIcon: { fontSize: "md" },
				optionLabel: { fontSize: "xs" },
			},
			lg: {
				option: {
					py: "2",
					px: "4",
					fontSize: "sm",
					minH: "10",
				},
				optionIcon: { fontSize: "lg" },
				optionLabel: { fontSize: "sm" },
			},
		},
		fullWidth: {
			true: {
				root: { width: "full" },
				group: { width: "full" },
			},
		},
		variant: {
			default: {},
			pill: {
				root: {
					flexDirection: "row",
				},
				group: {
					gap: "1",
				},
				option: {
					flex: "none",
					flexDirection: "row",
					borderRadius: "full",
					borderWidth: "1px",
					borderColor: "transparent",
					bg: "transparent",
					color: "fg.muted",
					minH: "auto",
					_hover: {
						bg: "stone.100",
						borderColor: "transparent",
						color: "fg.default",
					},
					"&[data-selected]": {
						bg: "brand.subtle",
						borderColor: "brand.muted",
						borderWidth: "1px",
						borderStyle: "solid",
						color: "brand.emphasis",
					},
					"&[data-selected]:hover": {
						bg: "brand.subtle",
						borderColor: "brand.muted",
						color: "brand.emphasis",
					},
					_disabled: {
						opacity: "50",
						cursor: "not-allowed",
						_hover: {
							bg: "transparent",
							borderColor: "transparent",
							color: "fg.muted",
						},
					},
					"&[data-disabled]": {
						opacity: "50",
						cursor: "not-allowed",
						_hover: {
							bg: "transparent",
							borderColor: "transparent",
							color: "fg.muted",
						},
					},
				},
			},
		},
	},
	defaultVariants: {
		size: "md",
		variant: "default",
	},
})

// ---------- Context ----------

interface SegmentedContextValue {
	value: string
	onSelect: (value: string) => void
	name: string
	disabled?: boolean
	labelId: string
	slots: ReturnType<typeof segmented>
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

type SegmentedVariantProps = {
	size?: "sm" | "md" | "lg"
	fullWidth?: boolean
	variant?: "default" | "pill"
}

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
	size,
	fullWidth,
	variant,
	...rest
}: SegmentedProps) {
	const slots = segmented({ size, fullWidth, variant })

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
				{...rest}
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
