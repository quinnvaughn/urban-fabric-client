import * as React from "react"
import { css, cx } from "@/styles/styled-system/css"
import { input as inputRecipe } from "@/styles/styled-system/recipes"
import type { SystemStyleObject } from "@/styles/styled-system/types"

// ---------- Context ----------

interface InputContextValue {
	id: string
	invalid?: boolean
	describedByIds: Set<string>
	registerDescribedBy: (id: string) => () => void
	required?: boolean
	classes: ReturnType<typeof inputRecipe>
}

const InputContext = React.createContext<InputContextValue | null>(null)

function useInputContext() {
	const ctx = React.useContext(InputContext)
	if (!ctx) {
		throw new Error(
			"Input.Label, Input.Field, Input.Error, and Input.Description must be used within <Input>",
		)
	}
	return ctx
}

// ---------- Root ----------

export interface InputRootProps extends React.HTMLAttributes<HTMLDivElement> {
	id?: string
	invalid?: boolean
	required?: boolean
	size?: "sm" | "md" | "lg"
	variant?: "outline" | "ghost"
}

function InputRoot({
	id: idProp,
	invalid,
	size,
	variant,
	className,
	children,
	required,
	...rest
}: InputRootProps) {
	const autoId = React.useId()
	const id = idProp ?? autoId
	const classes = inputRecipe({ size, variant, invalid: invalid ? true : undefined })

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
			invalid,
			describedByIds: describedByIds.current,
			registerDescribedBy,
			required,
			classes,
		}),
		[id, invalid, registerDescribedBy, required, classes],
	)

	return (
		<InputContext.Provider value={ctxValue}>
			<div className={cx(classes.root, className)} {...rest}>
				{children}
			</div>
		</InputContext.Provider>
	)
}

// ---------- Label ----------

export interface InputLabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {}

function InputLabel({
	className,
	htmlFor,
	children,
	...rest
}: InputLabelProps) {
	const { id, required, classes } = useInputContext()

	const { counters, rest: otherChildren } = React.Children.toArray(
		children,
	).reduce<{
		counters: React.ReactNode[]
		rest: React.ReactNode[]
	}>(
		(acc, child) => {
			if (React.isValidElement(child) && child.type === InputCounter) {
				acc.counters.push(child)
			} else {
				acc.rest.push(child)
			}
			return acc
		},
		{ counters: [], rest: [] },
	)

	return (
		<label
			className={cx(classes.label, className)}
			htmlFor={htmlFor ?? id}
			{...rest}
		>
			<span className={classes.labelText}>
				{otherChildren}
				{required && (
					<span className={css({ marginLeft: "0.5", color: "danger.default" })}>
						*
					</span>
				)}
			</span>
			{counters}
		</label>
	)
}
InputLabel.displayName = "Input.Label"

// ---------- Counter ----------

export interface InputCounterProps
	extends React.HTMLAttributes<HTMLSpanElement> {
	current: number
	max: number
	warnAt?: number
}

function InputCounter({
	current,
	max,
	warnAt,
	className,
	...rest
}: InputCounterProps) {
	const { classes } = useInputContext()
	const threshold = warnAt ?? Math.floor(max * 0.9)
	const isWarn = current >= threshold
	const isOver = current >= max

	return (
		<span
			className={cx(classes.counter, className)}
			data-warn={isWarn ? "" : undefined}
			data-over={isOver ? "" : undefined}
			aria-live="polite"
			{...rest}
		>
			{current} / {max}
		</span>
	)
}
InputCounter.displayName = "Input.Counter"

// ---------- Field ----------

export interface InputFieldProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
	invalid?: boolean
	startAdornment?: React.ReactNode
	endAdornment?: React.ReactNode
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
	(
		{
			invalid: invalidProp,
			className,
			id: idProp,
			"aria-describedby": describedByProp,
			required: requiredProp,
			startAdornment,
			endAdornment,
			disabled,
			readOnly,
			onFocus,
			onBlur,
			...rest
		},
		ref,
	) => {
		const {
			id: ctxId,
			invalid: ctxInvalid,
			describedByIds,
			required: ctxRequired,
			classes,
		} = useInputContext()
		const id = idProp ?? ctxId
		const invalid = invalidProp ?? ctxInvalid
		const [focused, setFocused] = React.useState(false)

		const describedBy = React.useMemo(() => {
			const ids = new Set<string>()
			if (describedByProp) {
				for (const part of describedByProp.split(" ")) {
					if (part.trim()) ids.add(part.trim())
				}
			}
			for (const part of describedByIds) ids.add(part)
			return ids.size ? Array.from(ids).join(" ") : undefined
		}, [describedByProp, describedByIds])

		return (
			<div
				className={classes.field}
				data-focused={focused ? "" : undefined}
				data-disabled={disabled ? "" : undefined}
				data-read-only={readOnly ? "" : undefined}
			>
				{startAdornment && (
					<div className={classes.adornment}>{startAdornment}</div>
				)}
				<input
					ref={ref}
					id={id}
					className={cx(classes.input, className)}
					aria-invalid={invalid ? "true" : undefined}
					aria-describedby={describedBy}
					required={requiredProp ?? ctxRequired}
					disabled={disabled}
					readOnly={readOnly}
					onFocus={(e) => {
						setFocused(true)
						onFocus?.(e)
					}}
					onBlur={(e) => {
						setFocused(false)
						onBlur?.(e)
					}}
					{...rest}
				/>
				{endAdornment && (
					<div className={classes.adornment}>{endAdornment}</div>
				)}
			</div>
		)
	},
)
InputField.displayName = "Input.Field"

// ---------- Description ----------

export interface InputDescriptionProps
	extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color"> {
	sx?: SystemStyleObject
}

function InputDescription({
	className,
	id,
	sx,
	...rest
}: InputDescriptionProps) {
	const { id: baseId, registerDescribedBy, classes } = useInputContext()
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
InputDescription.displayName = "Input.Description"

// ---------- Error ----------

export interface InputErrorProps
	extends React.HTMLAttributes<HTMLParagraphElement> {}

function InputError({ className, id, ...rest }: InputErrorProps) {
	const { id: baseId, registerDescribedBy, classes } = useInputContext()
	const errorId = id ?? `${baseId}-error`

	React.useEffect(
		() => registerDescribedBy(errorId),
		[registerDescribedBy, errorId],
	)

	return <p className={cx(classes.error, className)} id={errorId} {...rest} />
}
InputError.displayName = "Input.Error"

// ---------- Dot-notation export ----------

export const Input = Object.assign(InputRoot, {
	Label: InputLabel,
	Counter: InputCounter,
	Field: InputField,
	Error: InputError,
	Description: InputDescription,
})
