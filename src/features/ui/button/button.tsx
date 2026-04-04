import * as React from "react"
import { css, cx } from "@/styles/styled-system/css"
import {
	type ButtonVariantProps,
	button as buttonRecipe,
} from "@/styles/styled-system/recipes"

// ---------- Types ----------

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		ButtonVariantProps {
	loading?: boolean
	startIcon?: React.ReactNode
	endIcon?: React.ReactNode
}

// ---------- Button ----------

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			appearance,
			intent,
			size,
			fullWidth,
			lift,
			loading = false,
			disabled,
			startIcon,
			endIcon,
			className,
			children,
			...rest
		},
		ref,
	) => {
		const isDisabled = disabled || loading

		return (
			<button
				ref={ref}
				type="button"
				disabled={isDisabled}
				data-disabled={isDisabled ? "" : undefined}
				data-loading={loading ? "" : undefined}
				className={cx(
					buttonRecipe({ appearance, intent, size, fullWidth, lift }),
					className,
				)}
				{...rest}
			>
				{loading ? (
					<Spinner />
				) : (
					startIcon && <span aria-hidden="true">{startIcon}</span>
				)}
				{children}
				{!loading && endIcon && <span aria-hidden="true">{endIcon}</span>}
			</button>
		)
	},
)
Button.displayName = "Button"

// ---------- Spinner ----------

function Spinner() {
	return (
		<svg
			aria-hidden="true"
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			className={css({ animation: "spin 0.7s linear infinite" })}
		>
			<circle
				cx="7"
				cy="7"
				r="5.5"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeDasharray="26"
				strokeDashoffset="10"
				opacity="0.85"
			/>
		</svg>
	)
}
