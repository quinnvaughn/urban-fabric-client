import type { JSX } from "react"
import { cx } from "../../../styles/styled-system/css"
import {
	type FlexVariantProps,
	flex,
} from "../../../styles/styled-system/recipes"

type FlexProps = {
	as?: keyof JSX.IntrinsicElements
} & FlexVariantProps &
	JSX.IntrinsicElements["div"]

export function Flex({
	as = "div",
	direction = "row",
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
		flex({}),
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
