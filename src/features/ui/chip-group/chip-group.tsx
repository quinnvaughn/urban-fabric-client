import * as React from "react"
import { css, cx } from "@/styles/styled-system/css"
import { chipGroup as chipGroupRecipe } from "@/styles/styled-system/recipes"
import type { SystemStyleObject } from "@/styles/styled-system/types"

// ---------- Context ----------

interface ChipGroupContextValue {
	id: string
	value: string[]
	onChange: (value: string[]) => void
	multiple: boolean
	invalid?: boolean
	required?: boolean
	disabled?: boolean
	describedByIds: Set<string>
	registerDescribedBy: (id: string) => () => void
	classes: ReturnType<typeof chipGroupRecipe>
}

const ChipGroupContext = React.createContext<ChipGroupContextValue | null>(null)

function useChipGroupContext() {
	const ctx = React.useContext(ChipGroupContext)
	if (!ctx) {
		throw new Error(
			"ChipGroup.Chip, ChipGroup.Label, etc. must be used within <ChipGroup>",
		)
	}
	return ctx
}

// ---------- Root ----------

export interface ChipGroupRootProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
	id?: string
	value: string[]
	onChange: (value: string[]) => void
	multiple?: boolean
	invalid?: boolean
	required?: boolean
	disabled?: boolean
}

function ChipGroupRoot({
	id: idProp,
	value,
	onChange,
	multiple = true,
	invalid,
	required,
	disabled,
	className,
	children,
	...rest
}: ChipGroupRootProps) {
	const autoId = React.useId()
	const id = idProp ?? autoId
	const classes = chipGroupRecipe({ invalid: invalid ? true : undefined })

	const describedByIds = React.useRef<Set<string>>(new Set())

	const registerDescribedBy = React.useCallback((describedById: string) => {
		describedByIds.current.add(describedById)
		return () => {
			describedByIds.current.delete(describedById)
		}
	}, [])

	const ctxValue = React.useMemo(
		() => ({
			id,
			value,
			onChange,
			multiple,
			invalid,
			required,
			disabled,
			describedByIds: describedByIds.current,
			registerDescribedBy,
			classes,
		}),
		[
			id,
			value,
			onChange,
			multiple,
			invalid,
			required,
			disabled,
			registerDescribedBy,
			classes,
		],
	)

	return (
		<ChipGroupContext.Provider value={ctxValue}>
			<div className={cx(classes.root, className)} {...rest}>
				{children}
			</div>
		</ChipGroupContext.Provider>
	)
}

// ---------- Label ----------

export interface ChipGroupLabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {}

function ChipGroupLabel({
	className,
	htmlFor,
	children,
	...rest
}: ChipGroupLabelProps) {
	const { id, required, classes } = useChipGroupContext()

	return (
		<label
			className={cx(classes.label, className)}
			htmlFor={htmlFor ?? id}
			{...rest}
		>
			<span className={classes.labelText}>
				{children}
				{required && (
					<span className={css({ marginLeft: "0.5", color: "danger.default" })}>
						*
					</span>
				)}
			</span>
		</label>
	)
}
ChipGroupLabel.displayName = "ChipGroup.Label"

// ---------- Group ----------

export interface ChipGroupGroupProps
	extends React.HTMLAttributes<HTMLDivElement> {}

function ChipGroupGroup({ className, children, ...rest }: ChipGroupGroupProps) {
	const { id, classes } = useChipGroupContext()

	return (
		<div id={id} className={cx(classes.group, className)} {...rest}>
			{children}
		</div>
	)
}
ChipGroupGroup.displayName = "ChipGroup.Group"

// ---------- Chip ----------

export interface ChipGroupChipProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
	value: string
	color?: string
}

function ChipGroupChip({
	value: chipValue,
	color,
	className,
	children,
	disabled: disabledProp,
	...rest
}: ChipGroupChipProps) {
	const {
		value,
		onChange,
		multiple,
		disabled: groupDisabled,
		classes,
	} = useChipGroupContext()

	const disabled = disabledProp ?? groupDisabled
	const selected = value.includes(chipValue)

	function handleClick() {
		if (disabled) return
		if (multiple) {
			onChange(
				selected ? value.filter((v) => v !== chipValue) : [...value, chipValue],
			)
		} else {
			onChange(selected ? [] : [chipValue])
		}
	}

	return (
		<button
			type="button"
			aria-disabled={disabled}
			data-selected={selected ? "" : undefined}
			data-disabled={disabled ? "" : undefined}
			className={cx(classes.chip, className)}
			onClick={handleClick}
			{...rest}
		>
			<span
				className={classes.chipDot}
				data-selected={selected ? "" : undefined}
				style={
					color && selected ? { background: color, opacity: 1 } : undefined
				}
			/>
			{children}
		</button>
	)
}
ChipGroupChip.displayName = "ChipGroup.Chip"

// ---------- Description ----------

export interface ChipGroupDescriptionProps
	extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color"> {
	sx?: SystemStyleObject
}

function ChipGroupDescription({
	className,
	id,
	sx,
	...rest
}: ChipGroupDescriptionProps) {
	const { id: baseId, registerDescribedBy, classes } = useChipGroupContext()
	const descId = id ?? `${baseId}-desc`

	React.useEffect(
		() => registerDescribedBy(descId),
		[registerDescribedBy, descId],
	)

	return (
		<p
			className={cx(classes.description, sx ? css(sx) : undefined, className)}
			id={descId}
			{...rest}
		/>
	)
}
ChipGroupDescription.displayName = "ChipGroup.Description"

// ---------- Error ----------

export interface ChipGroupErrorProps
	extends React.HTMLAttributes<HTMLParagraphElement> {}

function ChipGroupError({ className, id, ...rest }: ChipGroupErrorProps) {
	const { id: baseId, registerDescribedBy, classes } = useChipGroupContext()
	const errorId = id ?? `${baseId}-error`

	React.useEffect(
		() => registerDescribedBy(errorId),
		[registerDescribedBy, errorId],
	)

	return <p className={cx(classes.error, className)} id={errorId} {...rest} />
}
ChipGroupError.displayName = "ChipGroup.Error"

// ---------- Dot-notation export ----------

export const ChipGroup = Object.assign(ChipGroupRoot, {
	Label: ChipGroupLabel,
	Group: ChipGroupGroup,
	Chip: ChipGroupChip,
	Error: ChipGroupError,
	Description: ChipGroupDescription,
})
