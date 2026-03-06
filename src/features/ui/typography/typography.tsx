import { cx } from "@/styles/styled-system/css"
import {
	type TypographyVariantProps,
	typography,
} from "@/styles/styled-system/recipes"
import type { ColorToken } from "@/styles/styled-system/tokens"

// ---------- Shared prop types ----------

type Tone = NonNullable<TypographyVariantProps["tone"]>
type Font = NonNullable<TypographyVariantProps["font"]>
type Weight = NonNullable<TypographyVariantProps["weight"]>
type Color = ColorToken

// ---------- Text ----------

type TextSize = Extract<NonNullable<TypographyVariantProps["textSize"]>, string>

const TEXT_ELEMENT_MAP: Record<TextSize, React.ElementType> = {
	xs: "span",
	sm: "span",
	md: "p",
	lg: "p",
	xl: "p",
	"2xl": "p",
}

export interface TextProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
	as?: React.ElementType
	size?: TextSize
	weight?: Weight
	tone?: Tone
	font?: Font
	color?: Color
}

function TypographyText({
	as,
	size = "md",
	weight,
	tone,
	font,
	color,
	className,
	style,
	...rest
}: TextProps) {
	const styles = typography({ textSize: size, weight, tone, font })
	const Tag = as ?? TEXT_ELEMENT_MAP[size]
	return (
		<Tag
			className={cx(styles.text, className)}
			style={
				color
					? { ...style, color: `var(--colors-${color.replace(/\./g, "-")})` }
					: style
			}
			{...rest}
		/>
	)
}
TypographyText.displayName = "Typography.Text"

// ---------- Heading ----------

type HeadingSize = Extract<
	NonNullable<TypographyVariantProps["headingSize"]>,
	string
>

const HEADING_ELEMENT_MAP: Record<HeadingSize, React.ElementType> = {
	sm: "h4",
	md: "h3",
	lg: "h2",
	xl: "h1",
	"2xl": "h1",
}

export interface HeadingProps
	extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "color"> {
	as?: React.ElementType
	size?: HeadingSize
	weight?: Weight
	tone?: Tone
	font?: Font
	color?: Color
}

function TypographyHeading({
	as,
	size = "md",
	weight,
	tone,
	font,
	color,
	className,
	style,
	...rest
}: HeadingProps) {
	const styles = typography({ headingSize: size, weight, tone, font })
	const Tag = as ?? HEADING_ELEMENT_MAP[size]
	return (
		<Tag
			className={cx(styles.heading, className)}
			style={
				color
					? { ...style, color: `var(--colors-${color.replace(/\./g, "-")})` }
					: style
			}
			{...rest}
		/>
	)
}
TypographyHeading.displayName = "Typography.Heading"

// ---------- Dot-notation export ----------

export const Typography = {
	Text: TypographyText,
	Heading: TypographyHeading,
}
