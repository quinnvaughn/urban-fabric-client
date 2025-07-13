import type { JSX } from "react"
import { css, cx } from "../../../../styled-system/css"
import { type GridVariantProps, grid } from "../../../../styled-system/recipes"

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

	const extraStyles = css({
		gridTemplateColumns: templateColumns,
		gridTemplateRows: templateRows,
		gridTemplateAreas: templateAreas,
		gridAutoRows: autoRows,
		gridAutoColumns: autoColumns,
	})

	const className = cx(recipeClass, extraStyles, propsClass)

	return <Component className={className}>{children}</Component>
}
