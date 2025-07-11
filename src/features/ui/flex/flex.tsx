import type { JSX } from "react"
import { cx } from "../../../../styled-system/css"
import { type FlexVariantProps, flex } from "../../../../styled-system/recipes"

type FlexProps = {
	as?: keyof JSX.IntrinsicElements
} & FlexVariantProps &
	JSX.IntrinsicElements["div"]

export function Flex({
	as = "div",
	direction,
	align,
	justify,
	gap,
	grow,
	flex: flexProp,
	wrap,
	shrink,
	basis,
	className: propsClass,
	children,
}: FlexProps) {
	const Component = as

	const className = cx(
		flex({
			direction,
			align,
			justify,
			gap,
			grow,
			flex: flexProp,
			wrap,
			shrink,
			basis,
		}),
		propsClass,
	)

	return <Component className={className}>{children}</Component>
}
