import * as React from "react"
import { css, cx } from "@/styles/styled-system/css"
import { input as inputRecipe } from "@/styles/styled-system/recipes"
import type { SystemStyleObject } from "@/styles/styled-system/types"

// ---------- Context ----------

interface TextareaContextValue {
	id: string
	invalid?: boolean
	describedByIds: Set<string>
	registerDescribedBy: (id: string) => () => void
	required?: boolean
	classes: ReturnType<typeof inputRecipe>
}

const TextareaContext = React.createContext<TextareaContextValue | null>(null)

function useTextareaContext() {
	const ctx = React.useContext(TextareaContext)
	if (!ctx) {
		throw new Error(
			"Textarea.Label, Textarea.Field, Textarea.Error, and Textarea.Description must be used within <Textarea>",
		)
	}
	return ctx
}

// ---------- Root ----------

export interface TextareaRootProps
	extends React.HTMLAttributes<HTMLDivElement> {
	id?: string
	invalid?: boolean
	required?: boolean
	size?: "sm" | "md" | "lg"
}

function TextareaRoot({
	id: idProp,
	invalid,
	size,
	className,
	children,
	required,
	...rest
}: TextareaRootProps) {
	const autoId = React.useId()
	const id = idProp ?? autoId
	const classes = inputRecipe({ size, invalid: invalid ? true : undefined })

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
		<TextareaContext.Provider value={ctxValue}>
			<div className={cx(classes.root, className)} {...rest}>
				{children}
			</div>
		</TextareaContext.Provider>
	)
}

// ---------- Label ----------

export interface TextareaLabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {}

function TextareaLabel({
	className,
	htmlFor,
	children,
	...rest
}: TextareaLabelProps) {
	const { id, required, classes } = useTextareaContext()

	const { counters, rest: otherChildren } = React.Children.toArray(
		children,
	).reduce<{
		counters: React.ReactNode[]
		rest: React.ReactNode[]
	}>(
		(acc, child) => {
			if (React.isValidElement(child) && child.type === TextareaCounter) {
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
TextareaLabel.displayName = "Textarea.Label"

// ---------- Counter ----------

export interface TextareaCounterProps
	extends React.HTMLAttributes<HTMLSpanElement> {
	current: number
	max: number
	warnAt?: number
}

function TextareaCounter({
	current,
	max,
	warnAt,
	className,
	...rest
}: TextareaCounterProps) {
	const { classes } = useTextareaContext()
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
TextareaCounter.displayName = "Textarea.Counter"

// ---------- Field ----------

export interface TextareaFieldProps
	extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
	invalid?: boolean
	minRows?: number
	maxRows?: number
	resize?: "none" | "vertical" | "horizontal" | "both"
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
	(
		{
			invalid: invalidProp,
			className,
			id: idProp,
			"aria-describedby": describedByProp,
			required: requiredProp,
			disabled,
			readOnly,
			onFocus,
			onBlur,
			minRows = 3,
			maxRows,
			resize = "none",
			style,
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
		} = useTextareaContext()
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
				<textarea
					ref={ref}
					id={id}
					className={cx(classes.input, className)}
					aria-invalid={invalid ? "true" : undefined}
					aria-describedby={describedBy}
					required={requiredProp ?? ctxRequired}
					disabled={disabled}
					readOnly={readOnly}
					rows={minRows}
					style={{
						resize,
						...(maxRows
							? {
									maxHeight: `calc(${maxRows} * 1.6em + 20px)`,
									overflowY: "auto",
								}
							: {}),
						...style,
					}}
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
			</div>
		)
	},
)
TextareaField.displayName = "Textarea.Field"

// ---------- Description ----------

export interface TextareaDescriptionProps
	extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color"> {
	sx?: SystemStyleObject
}

function TextareaDescription({
	className,
	id,
	sx,
	...rest
}: TextareaDescriptionProps) {
	const { id: baseId, registerDescribedBy, classes } = useTextareaContext()
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
TextareaDescription.displayName = "Textarea.Description"

// ---------- Error ----------

export interface TextareaErrorProps
	extends React.HTMLAttributes<HTMLParagraphElement> {}

function TextareaError({ className, id, ...rest }: TextareaErrorProps) {
	const { id: baseId, registerDescribedBy, classes } = useTextareaContext()
	const errorId = id ?? `${baseId}-error`

	React.useEffect(
		() => registerDescribedBy(errorId),
		[registerDescribedBy, errorId],
	)

	return <p className={cx(classes.error, className)} id={errorId} {...rest} />
}
TextareaError.displayName = "Textarea.Error"

// ---------- Dot-notation export ----------

export const Textarea = Object.assign(TextareaRoot, {
	Label: TextareaLabel,
	Counter: TextareaCounter,
	Field: TextareaField,
	Error: TextareaError,
	Description: TextareaDescription,
})
