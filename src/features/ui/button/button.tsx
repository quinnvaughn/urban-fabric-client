import type { JSX, ReactNode } from "react"
import { cx } from "../../../../styled-system/css"
import {
	type ButtonVariantProps,
	button,
} from "../../../../styled-system/recipes"

type Props = {
	type?: "button" | "submit" | "reset"
	children?: ReactNode
} & ButtonVariantProps &
	JSX.IntrinsicElements["button"]

export function Button({
	variant,
	size,
	type,
	intent,
	className: propsClass,
	children,
	...rest
}: Props) {
	return (
		<button
			type={type}
			className={cx(button({ variant, size, intent }), propsClass)}
			{...rest}
		>
			{children}
		</button>
	)
}
