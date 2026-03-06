// import { Info } from "lucide-react"
import * as React from "react"
import { css, cx } from "@/styles/styled-system/css"
import { input as inputRecipe } from "@/styles/styled-system/recipes"
import type { SystemStyleObject } from "@/styles/styled-system/types"

// import { Tooltip } from "../tooltip"

// ---------- Context ----------

interface InputContextValue {
	id: string
	invalid?: boolean
	describedByIds: Set<string>
	registerDescribedBy: (id: string) => () => void
	required?: boolean
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

const inputRootStyles = css({
	display: "flex",
	flexDirection: "column",
	gap: "1",
})

export interface InputRootProps extends React.HTMLAttributes<HTMLDivElement> {
	id?: string
	invalid?: boolean
	required?: boolean
}

function InputRoot({
	id: idProp,
	invalid,
	className,
	children,
	required,
	...rest
}: InputRootProps) {
	const autoId = React.useId()
	const id = idProp ?? autoId

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
		}),
		[id, invalid, registerDescribedBy, required],
	)

	return (
		<InputContext.Provider value={ctxValue}>
			<div className={cx(inputRootStyles, className)} {...rest}>
				{children}
			</div>
		</InputContext.Provider>
	)
}

// ---------- Label ----------

const inputLabelStyles = css({
	fontSize: "xs",
	fontWeight: "semibold",
	letterSpacing: "wider",
	textTransform: "uppercase",
	color: "fg.muted",
})

const inputLabelRequiredStyles = css({
	marginLeft: "0.5",
	color: "danger.default",
})

export interface InputLabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {
	help?: string
}

function InputLabel({ className, htmlFor, help, ...rest }: InputLabelProps) {
	const { id, required } = useInputContext()

	return (
		<label
			className={cx(inputLabelStyles, className)}
			htmlFor={htmlFor ?? id}
			{...rest}
		>
			{rest.children}
			{required && <span className={inputLabelRequiredStyles}>*</span>}
			{/* {help && (
				<Tooltip>
					<Tooltip.Trigger asChild>
						<button
							type="button"
							className={css({
								display: "inline-flex",
								alignItems: "center",
								marginLeft: "1",
								color: "fg.subtle",
								cursor: "help",
							})}
							aria-label="Help"
							onClick={(e) => e.preventDefault()}
						>
							<Info size={12} />
						</button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						{help}
						<Tooltip.Arrow />
					</Tooltip.Content>
				</Tooltip>
			)} */}
		</label>
	)
}
InputLabel.displayName = "Input.Label"

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
	const { id: baseId, registerDescribedBy } = useInputContext()
	const descId = id ?? `${baseId}-desc`

	React.useEffect(
		() => registerDescribedBy(descId),
		[registerDescribedBy, descId],
	)

	return (
		<p
			className={cx(
				css(
					{
						fontSize: "xs",
						color: "fg.subtle",
					},
					sx,
				),
				className,
			)}
			id={descId}
			{...rest}
		/>
	)
}
InputDescription.displayName = "Input.Description"

// ---------- Field ----------

export interface InputFieldProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
	size?: "sm" | "md" | "lg"
	invalid?: boolean
	startAdornment?: React.ReactNode
	endAdornment?: React.ReactNode
}

const fieldRowStyles = css({
	display: "flex",
	alignItems: "center",
	gap: "2",
})

const fieldInputStyles = css({
	flex: "1 1 auto",
	minWidth: 0,
	width: "full",
	border: "none",
	outline: "none",
	background: "transparent",
	padding: 0,
	appearance: "none",
	font: "inherit",
	color: "fg.default",
})

const adornmentStyles = css({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	color: "fg.subtle",
	flex: "0 0 auto",
})
const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
	(
		{
			size = "md",
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
		const ctx = useInputContext()
		const id = idProp ?? ctx.id
		const invalid = invalidProp ?? ctx.invalid
		const [focused, setFocused] = React.useState(false)

		const describedBy = React.useMemo(() => {
			const ids = new Set<string>()
			if (describedByProp) {
				for (const part of describedByProp.split(" ")) {
					if (part.trim()) ids.add(part.trim())
				}
			}
			for (const part of ctx.describedByIds) ids.add(part)
			return ids.size ? Array.from(ids).join(" ") : undefined
		}, [describedByProp, ctx.describedByIds])

		return (
			<div
				className={cx(
					inputRecipe({ size, invalid: invalid ? true : undefined }),
					fieldRowStyles,
				)}
				data-focused={focused ? "" : undefined}
				data-disabled={disabled ? "" : undefined}
				data-read-only={readOnly ? "" : undefined}
			>
				{startAdornment && (
					<div className={adornmentStyles}>{startAdornment}</div>
				)}

				<input
					ref={ref}
					id={id}
					className={cx(fieldInputStyles, className)}
					aria-invalid={invalid ? "true" : undefined}
					aria-describedby={describedBy}
					required={requiredProp ?? ctx.required}
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

				{endAdornment && <div className={adornmentStyles}>{endAdornment}</div>}
			</div>
		)
	},
)
InputField.displayName = "Input.Field"

// ---------- Error ----------

const inputErrorStyles = css({
	fontSize: "xs",
	color: "danger.default",
})

export interface InputErrorProps
	extends React.HTMLAttributes<HTMLParagraphElement> {}

function InputError({ className, id, ...rest }: InputErrorProps) {
	const { id: baseId, registerDescribedBy } = useInputContext()
	const errorId = id ?? `${baseId}-error`

	React.useEffect(
		() => registerDescribedBy(errorId),
		[registerDescribedBy, errorId],
	)

	return (
		<p className={cx(inputErrorStyles, className)} id={errorId} {...rest} />
	)
}
InputError.displayName = "Input.Error"

// ---------- Dot-notation export ----------

export const Input = Object.assign(InputRoot, {
	Label: InputLabel,
	Field: InputField,
	Error: InputError,
	Description: InputDescription,
})
