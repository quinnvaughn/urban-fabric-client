// ui/checkbox.tsx

import {
	createContext,
	type InputHTMLAttributes,
	type ReactNode,
	useContext,
	useId,
} from "react"
import { css, cx } from "../../../styles/styled-system/css"
import { Icon } from "../icon"

const CheckboxContext = createContext<{ id: string } | null>(null)

type RootProps = {
	children: ReactNode
	className?: string
}

export function Checkbox({ children, className }: RootProps) {
	const id = useId()
	return (
		<CheckboxContext.Provider value={{ id }}>
			<label
				htmlFor={id}
				className={cx(
					css({ display: "inline-flex", alignItems: "center", gap: "xs" }),
					className,
				)}
			>
				{children}
			</label>
		</CheckboxContext.Provider>
	)
}

type InputProps = InputHTMLAttributes<HTMLInputElement>

Checkbox.Input = function Input(props: InputProps) {
	const context = useContext(CheckboxContext)
	if (!context)
		throw new Error("Checkbox.Input must be used within Checkbox.Root")

	return (
		<span
			className={css({
				position: "relative",
				width: "1rem",
				height: "1rem",
				border: "1px solid",
				borderColor: "neutral.300",
				borderRadius: "sm",
				bg: "neutral.0",
				display: "inline-block",
			})}
		>
			<input
				id={context.id}
				type="checkbox"
				{...props}
				className={css({
					opacity: 0,
					position: "absolute",
					inset: 0,
					margin: 0,
					cursor: "pointer",
					width: "100%",
					height: "100%",
				})}
			/>
			{props.checked && (
				<Icon
					name="Check"
					size={18}
					className={css({
						position: "absolute",
						top: "50%",
						left: "50%",
						fill: "secondary",
						transform: "translate(-50%, -50%)",
						pointerEvents: "none",
					})}
				/>
			)}
		</span>
	)
}

type LabelProps = {
	children: ReactNode
	className?: string
}

Checkbox.Label = function Label({ children, className }: LabelProps) {
	return (
		<span className={cx(css({ userSelect: "none" }), className)}>
			{children}
		</span>
	)
}
