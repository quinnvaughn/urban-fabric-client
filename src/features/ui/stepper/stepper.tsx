import { Minus, Plus } from "lucide-react"
import * as React from "react"
import { cx } from "@/styles/styled-system/css"
import { stepper as stepperRecipe } from "@/styles/styled-system/recipes"
import { FieldDescription, FieldLabel } from "../field"

interface StepperContextValue {
	value: number
	update: (next: number) => void
	step: number
	disabled?: boolean
	labelId: string
	atMin: boolean
	atMax: boolean
	size: "sm" | "md" | "lg"
	format?: (value: number) => string
	slots: ReturnType<typeof stepperRecipe>
}

const StepperContext = React.createContext<StepperContextValue | null>(null)

function useStepperContext() {
	const ctx = React.useContext(StepperContext)
	if (!ctx) {
		throw new Error("Stepper sub-components must be used within <Stepper>")
	}
	return ctx
}

export interface StepperProps
	extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange"> {
	value?: number
	defaultValue?: number
	onChange?: (value: number) => void
	min?: number
	max?: number
	step?: number
	/** Format the displayed value, e.g. (v) => `${v} m` */
	format?: (value: number) => string
	size?: "sm" | "md" | "lg"
	disabled?: boolean
}

function StepperRoot({
	value: valueProp,
	defaultValue = 0,
	onChange,
	min = -Infinity,
	max = Infinity,
	step = 1,
	format,
	size = "md",
	disabled,
	className,
	children,
	...rest
}: StepperProps) {
	const [internalValue, setInternalValue] = React.useState(defaultValue)
	const labelId = React.useId()

	const isControlled = valueProp !== undefined
	const value = isControlled ? valueProp : internalValue

	const slots = stepperRecipe({ size })

	const update = React.useCallback(
		(next: number) => {
			const clamped = Math.min(max, Math.max(min, parseFloat(next.toFixed(10))))
			if (!isControlled) setInternalValue(clamped)
			onChange?.(clamped)
		},
		[isControlled, max, min, onChange],
	)

	const atMin = value <= min
	const atMax = value >= max

	const ctx = React.useMemo(
		() => ({
			value,
			update,
			step,
			disabled,
			labelId,
			atMin,
			atMax,
			size,
			format,
			slots,
		}),
		[value, update, step, disabled, labelId, atMin, atMax, size, format, slots],
	)

	return (
		<StepperContext.Provider value={ctx}>
			<fieldset
				aria-labelledby={labelId}
				disabled={disabled}
				className={cx(slots.group, className)}
				{...rest}
			>
				{children}
			</fieldset>
		</StepperContext.Provider>
	)
}

function StepperLabel({
	children,
	...rest
}: Omit<React.HTMLAttributes<HTMLDivElement>, "color">) {
	const { labelId } = useStepperContext()
	return (
		<FieldLabel as="div" id={labelId} {...rest}>
			{children}
		</FieldLabel>
	)
}
StepperLabel.displayName = "Stepper.Label"

export interface StepperDescriptionProps
	extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color"> {}

function StepperDescription({ ...rest }: StepperDescriptionProps) {
	return <FieldDescription {...rest} />
}
StepperDescription.displayName = "Stepper.Description"

function StepperControl({
	className,
	...rest
}: React.HTMLAttributes<HTMLDivElement>) {
	const { value, update, step, disabled, atMin, atMax, size, format, slots } =
		useStepperContext()

	return (
		<div
			className={cx(slots.root, className)}
			data-disabled={disabled ? "" : undefined}
			{...rest}
		>
			<button
				type="button"
				className={slots.btn}
				onClick={() => update(value - step)}
				disabled={disabled || atMin}
				aria-label="Decrease"
			>
				<Minus size={size === "sm" ? 12 : size === "lg" ? 20 : 16} />
			</button>

			<span className={slots.value} aria-live="polite">
				{format ? format(value) : value}
			</span>

			<button
				type="button"
				className={slots.btn}
				onClick={() => update(value + step)}
				disabled={disabled || atMax}
				aria-label="Increase"
			>
				<Plus size={size === "sm" ? 12 : size === "lg" ? 20 : 16} />
			</button>
		</div>
	)
}
StepperControl.displayName = "Stepper.Control"

export const Stepper = Object.assign(StepperRoot, {
	Label: StepperLabel,
	Description: StepperDescription,
	Control: StepperControl,
})
