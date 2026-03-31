import * as React from "react"
import { cx, sva } from "@/styles/styled-system/css"

// ─── Recipe ─────────────────────────────────────────────────────────────────

const sliderRecipe = sva({
	className: "slider",
	slots: [
		"root",
		"label",
		"header",
		"value",
		"track",
		"thumb",
		"bounds",
		"boundMin",
		"boundMax",
		"description",
	],
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			gap: "1.5",
			w: "full",
		},
		label: {
			fontSize: "xs",
			fontWeight: "semibold",
			color: "stone.700",
			letterSpacing: "normal",
		},
		header: {
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start",
			gap: "0.5",
		},
		value: {
			fontSize: "sm",
			fontWeight: "semibold",
			color: "stone.900",
			fontVariantNumeric: "tabular-nums",
		},
		track: {
			position: "relative",
			w: "full",
			h: "1",
			borderRadius: "full",
			bg: "stone.300",
			cursor: "pointer",
			appearance: "none",
			outline: "none",
			border: "none",
			// Filled portion via inline style (see component)
			"&::-webkit-slider-thumb": {
				appearance: "none",
				w: "4",
				h: "4",
				borderRadius: "full",
				bg: "teal.600",
				boxShadow: "0 1px 4px token(colors.teal.700, rgba(26,107,90,0.3))",
				cursor: "pointer",
				transition:
					"background 150ms {easings.inOut}, transform 100ms {easings.inOut}, box-shadow 150ms {easings.inOut}",
			},
			"&::-webkit-slider-thumb:hover": {
				bg: "teal.700",
				boxShadow: "0 2px 8px token(colors.teal.700, rgba(26,107,90,0.4))",
				transform: "scale(1.1)",
			},
			"&::-moz-range-thumb": {
				w: "4",
				h: "4",
				borderRadius: "full",
				bg: "teal.600",
				border: "none",
				boxShadow: "0 1px 4px token(colors.teal.700, rgba(26,107,90,0.3))",
				cursor: "pointer",
			},
			"&:focus-visible::-webkit-slider-thumb": {
				boxShadow: "0 0 0 3px rgba(39, 141, 117, 0.20)",
			},
			"&[data-disabled]": {
				opacity: "50",
				cursor: "not-allowed",
				"&::-webkit-slider-thumb": {
					cursor: "not-allowed",
				},
			},
		},
		bounds: {
			display: "flex",
			justifyContent: "space-between",
		},
		boundMin: {
			fontSize: "3xs",
			fontWeight: "medium",
			color: "stone.400",
		},
		boundMax: {
			fontSize: "3xs",
			fontWeight: "medium",
			color: "stone.400",
		},
		description: {
			fontSize: "xxs",
			color: "fg.subtle",
		},
	},
})

// ─── Context ─────────────────────────────────────────────────────────────────

interface SliderContextValue {
	value: number
	min: number
	max: number
	step: number
	softMax?: number
	softMin?: number
	disabled?: boolean
	formatValue: (v: number) => string
	onChange: (v: number) => void
	classes: ReturnType<typeof sliderRecipe>
}

const SliderContext = React.createContext<SliderContextValue | null>(null)

function useSliderContext() {
	const ctx = React.useContext(SliderContext)
	if (!ctx) throw new Error("Slider subcomponents must be used within <Slider>")
	return ctx
}

// ─── Root ────────────────────────────────────────────────────────────────────

export interface SliderRootProps extends React.HTMLAttributes<HTMLDivElement> {
	value: number
	defaultValue?: number
	min?: number
	max?: number
	step?: number
	softMax?: number
	softMin?: number
	disabled?: boolean
	formatValue?: (v: number) => string
	onValueChange?: (v: number) => void
}

function SliderRoot({
	value: valueProp,
	defaultValue,
	min = 0,
	max = 100,
	step = 1,
	softMax,
	softMin,
	disabled,
	formatValue = (v) => String(v),
	onValueChange,
	className,
	children,
	...rest
}: SliderRootProps) {
	const [internalValue, setInternalValue] = React.useState(
		defaultValue ?? valueProp,
	)
	const isControlled = valueProp !== undefined && onValueChange !== undefined
	const value = isControlled ? valueProp : internalValue

	const classes = sliderRecipe()

	const handleChange = React.useCallback(
		(v: number) => {
			if (!isControlled) setInternalValue(v)
			onValueChange?.(v)
		},
		[isControlled, onValueChange],
	)

	return (
		<SliderContext.Provider
			value={{
				value,
				min,
				max,
				step,
				softMax,
				softMin,
				disabled,
				formatValue,
				onChange: handleChange,
				classes,
			}}
		>
			<div className={cx(classes.root, className)} {...rest}>
				{children}
			</div>
		</SliderContext.Provider>
	)
}

// ─── Label ───────────────────────────────────────────────────────────────────

export interface SliderLabelProps
	extends React.HTMLAttributes<HTMLSpanElement> {}

function SliderLabel({ className, children, ...rest }: SliderLabelProps) {
	const { classes } = useSliderContext()
	return (
		<span className={cx(classes.label, className)} {...rest}>
			{children}
		</span>
	)
}
SliderLabel.displayName = "Slider.Label"

// ─── Header ──────────────────────────────────────────────────────────────────
// Convenience wrapper that renders label + value side by side.

export interface SliderHeaderProps
	extends React.HTMLAttributes<HTMLDivElement> {}

function SliderHeader({ className, children, ...rest }: SliderHeaderProps) {
	const { classes } = useSliderContext()
	return (
		<div className={cx(classes.header, className)} {...rest}>
			{children}
		</div>
	)
}
SliderHeader.displayName = "Slider.Header"

// ─── Value ───────────────────────────────────────────────────────────────────

export interface SliderValueProps
	extends React.HTMLAttributes<HTMLSpanElement> {}

function SliderValue({ className, ...rest }: SliderValueProps) {
	const { value, formatValue, classes } = useSliderContext()
	return (
		<span className={cx(classes.value, className)} {...rest}>
			{formatValue(value)}
		</span>
	)
}
SliderValue.displayName = "Slider.Value"

// ─── Track ───────────────────────────────────────────────────────────────────

export interface SliderTrackProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"value" | "min" | "max" | "step" | "type" | "onChange"
	> {}

function SliderTrack({ className, style, ...rest }: SliderTrackProps) {
	const { value, min, max, step, softMax, softMin, disabled, onChange, classes } =
		useSliderContext()
	const pct = ((value - min) / (max - min)) * 100

	let background: string
	if (softMax !== undefined && softMax < max) {
		const softPct = ((softMax - min) / (max - min)) * 100
		background = `linear-gradient(to right, var(--colors-teal-500) ${pct}%, var(--colors-stone-300) ${pct}% ${softPct}%, var(--colors-amber-300) ${softPct}% 100%)`
	} else if (softMin !== undefined && softMin > min) {
		const softPct = ((softMin - min) / (max - min)) * 100
		background = `linear-gradient(to right, var(--colors-amber-300) 0% ${softPct}%, var(--colors-stone-300) ${softPct}% ${pct}%, var(--colors-teal-500) ${pct}% 100%)`
	} else {
		background = `linear-gradient(to right, var(--colors-teal-500) ${pct}%, var(--colors-stone-300) ${pct}%)`
	}

	return (
		<input
			type="range"
			min={min}
			max={max}
			step={step}
			value={value}
			disabled={disabled}
			data-disabled={disabled ? "" : undefined}
			className={cx(classes.track, className)}
			style={{ background, ...style }}
			onChange={(e) => onChange(parseFloat(e.target.value))}
			{...rest}
		/>
	)
}
SliderTrack.displayName = "Slider.Track"

// ─── Bounds ──────────────────────────────────────────────────────────────────

export interface SliderBoundsProps
	extends React.HTMLAttributes<HTMLDivElement> {}

function SliderBounds({ className, ...rest }: SliderBoundsProps) {
	const { min, max, formatValue, classes } = useSliderContext()
	return (
		<div className={cx(classes.bounds, className)} {...rest}>
			<span className={classes.boundMin}>{formatValue(min)}</span>
			<span className={classes.boundMax}>{formatValue(max)}</span>
		</div>
	)
}
SliderBounds.displayName = "Slider.Bounds"

// ─── Description ─────────────────────────────────────────────────────────────

export interface SliderDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {}

function SliderDescription({ className, ...rest }: SliderDescriptionProps) {
	const { classes } = useSliderContext()
	return <p className={cx(classes.description, className)} {...rest} />
}
SliderDescription.displayName = "Slider.Description"

// ─── Dot-notation export ──────────────────────────────────────────────────────

export const Slider = Object.assign(SliderRoot, {
	Label: SliderLabel,
	Header: SliderHeader,
	Value: SliderValue,
	Track: SliderTrack,
	Bounds: SliderBounds,
	Description: SliderDescription,
})
