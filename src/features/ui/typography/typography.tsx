import type { JSX, ReactNode } from "react"
import { cx } from "../../../../styled-system/css"
import {
	type TypographyVariantProps,
	typography,
} from "../../../../styled-system/recipes"

type BaseProps = {
	children: ReactNode
	textStyle?: TypographyVariantProps["textStyle"]
	color?: TypographyVariantProps["color"]
	weight?: TypographyVariantProps["weight"]
	className?: string
}

type HeadingProps = BaseProps & {
	level?: 1 | 2 | 3 | 4 | 5 | 6
}

function Heading({
	color = "text",
	level = 1,
	textStyle = "2xl",
	weight = "bold",
	className: propClass,
	children,
}: HeadingProps) {
	const className = cx(
		typography({
			textStyle,
			weight,
			color,
		}),
		propClass,
	)
	const Tag = `h${level}` as keyof JSX.IntrinsicElements
	return <Tag className={className}>{children}</Tag>
}

type TextProps = BaseProps & {
	as?: Exclude<
		keyof JSX.IntrinsicElements,
		"h1" | "h2" | "h3" | "h4" | "h5" | "h6"
	>
}

function Text({
	as = "p",
	textStyle = "md",
	weight = "regular",
	children,
	color = "text",
	className: propClass,
}: TextProps) {
	const className = cx(
		typography({
			textStyle,
			color,
			weight,
		}),
		propClass,
	)
	const Tag = as
	return <Tag className={className}>{children}</Tag>
}

export const Typography = {
	Heading,
	Text,
}
