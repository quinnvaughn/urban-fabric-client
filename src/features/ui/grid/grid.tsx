import type { JSX } from "react"
import { cx } from "../../../styles/styled-system/css"
import {
	type GridVariantProps,
	grid,
} from "../../../styles/styled-system/recipes"

type GridProps = {
	as?: keyof JSX.IntrinsicElements
	className?: string
	children?: React.ReactNode
	templateColumns?: string
	templateRows?: string
	templateAreas?: string
	autoRows?: string
	autoColumns?: string
	style?: JSX.IntrinsicElements["div"]["style"]
} & GridVariantProps &
	JSX.IntrinsicElements["div"]

export function Grid({
	as = "div",
	gap,
	rowGap,
	columnGap,
	autoFlow,
	autoRows,
	autoColumns,
	templateRows,
	templateColumns,
	templateAreas,
	placeItems,
	alignItems,
	justifyItems,
	className: propsClass,
	children,
}: GridProps) {
	const Component = as

	const recipeClass = grid({
		gap,
		rowGap,
		columnGap,
		autoFlow,
		placeItems,
		alignItems,
		justifyItems,
	})

	const extraStyles = {
		gridTemplateColumns: templateColumns,
		gridTemplateRows: templateRows,
		gridTemplateAreas: templateAreas,
		gridAutoRows: autoRows,
		gridAutoColumns: autoColumns,
	}

	const className = cx(recipeClass, propsClass)

	return (
		<Component className={className} style={extraStyles}>
			{children}
		</Component>
	)
}
