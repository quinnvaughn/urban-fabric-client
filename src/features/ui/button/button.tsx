import type { JSX } from "react"
import { cx } from "../../../../styled-system/css"
import {
	type ButtonVariantProps,
	button,
} from "../../../../styled-system/recipes"

type Props = {
	type?: "button" | "submit" | "reset"
	class?: string
	children?: JSX.Element
} & ButtonVariantProps &
	JSX.IntrinsicElements["button"]

export function Button({
	variant = "primary",
	size = "md",
	type = "button",
	className: propsClass,
	children,
	...rest
}: Props) {
	return (
		<button
			type={type}
			class={cx(button({ variant, size }), propsClass)}
			{...rest}
		>
			{children}
		</button>
	)
}
