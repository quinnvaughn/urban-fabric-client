import { cx } from "@/styles/styled-system/css"
import {
	type TypographyVariantProps,
	typography,
} from "@/styles/styled-system/recipes"
import type { ColorToken } from "@/styles/styled-system/tokens"

// ── Shared types ──────────────────────────────────────────────────────────────

type Tone = NonNullable<TypographyVariantProps["tone"]>
type Font = NonNullable<TypographyVariantProps["font"]>
type Weight = NonNullable<TypographyVariantProps["weight"]>
type LineHeight = NonNullable<TypographyVariantProps["lineHeight"]>
type LetterSpacing = NonNullable<TypographyVariantProps["letterSpacing"]>
type FontStyle = NonNullable<TypographyVariantProps["fontStyle"]>
type Transform = NonNullable<TypographyVariantProps["transform"]>
type Clamp = NonNullable<TypographyVariantProps["clamp"]>
type Color = ColorToken
type TextAlign = NonNullable<TypographyVariantProps["textAlign"]>
type WhiteSpace = NonNullable<TypographyVariantProps["whiteSpace"]>

function colorStyle(color?: Color): React.CSSProperties | undefined {
	if (!color) return undefined
	return { color: `var(--colors-${color.replace(/\./g, "-")})` }
}

// ── Text ──────────────────────────────────────────────────────────────────────

type TextSize = Extract<NonNullable<TypographyVariantProps["textSize"]>, string>

const TEXT_ELEMENT_MAP: Record<TextSize, React.ElementType> = {
	"4xs": "span",
	"3xs": "span",
	xxs: "span",
	xs: "span",
	sm: "span",
	md: "p",
	lg: "p",
	xl: "p",
	"2xl": "p",
	"3xl": "p",
}

export interface TextProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
	as?: React.ElementType
	size?: TextSize
	weight?: Weight
	tone?: Tone
	font?: Font
	lineHeight?: LineHeight
	letterSpacing?: LetterSpacing
	transform?: Transform
	color?: Color
	clamp?: Clamp
	fontStyle?: FontStyle
	truncate?: boolean
	textAlign?: TextAlign
	whiteSpace?: WhiteSpace
}

function TypographyText({
	as,
	size = "md",
	weight,
	tone,
	font,
	lineHeight,
	letterSpacing,
	transform,
	color,
	fontStyle,
	className,
	style,
	clamp,
	truncate,
	textAlign,
	whiteSpace,
	...rest
}: TextProps) {
	const styles = typography({
		textSize: size,
		weight,
		tone,
		font,
		clamp,
		lineHeight,
		letterSpacing,
		transform,
		fontStyle,
		truncate,
		textAlign,
		whiteSpace,
	})
	const Tag = as ?? TEXT_ELEMENT_MAP[size]
	return (
		<Tag
			className={cx(styles.text, className)}
			style={{
				...colorStyle(color),
				...style,
			}}
			{...rest}
		/>
	)
}
TypographyText.displayName = "Typography.Text"

// ── Heading ───────────────────────────────────────────────────────────────────

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
	"3xl": "h1",
	"4xl": "h1",
}

export interface HeadingProps
	extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "color"> {
	as?: React.ElementType
	size?: HeadingSize
	weight?: Weight
	tone?: Tone
	font?: Font
	lineHeight?: LineHeight
	letterSpacing?: LetterSpacing
	transform?: Transform
	color?: Color
	fontStyle?: FontStyle
	truncate?: boolean
	clamp?: Clamp
}

function TypographyHeading({
	as,
	size = "md",
	weight,
	tone,
	font,
	lineHeight,
	letterSpacing,
	transform,
	color,
	fontStyle,
	truncate,
	className,
	style,
	clamp,
	...rest
}: HeadingProps) {
	const styles = typography({
		headingSize: size,
		weight,
		tone,
		font,
		lineHeight,
		letterSpacing,
		transform,
		fontStyle,
		truncate,
		clamp,
	})
	const Tag = as ?? HEADING_ELEMENT_MAP[size]
	return (
		<Tag
			className={cx(styles.heading, className)}
			style={{
				...colorStyle(color),
				...style,
			}}
			{...rest}
		/>
	)
}
TypographyHeading.displayName = "Typography.Heading"

// ── Inline ────────────────────────────────────────────────────────────────────

export interface InlineProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
	as?: React.ElementType
	fontStyle?: FontStyle
	weight?: Weight
	tone?: Tone
	font?: Font
	color?: Color
	letterSpacing?: LetterSpacing
	transform?: Transform
	size?: TextSize
}

function TypographyInline({
	as,
	fontStyle,
	weight,
	tone,
	font,
	color,
	letterSpacing,
	transform,
	className,
	style,
	size,
	...rest
}: InlineProps) {
	const styles = typography({
		weight,
		tone,
		font,
		letterSpacing,
		transform,
		fontStyle,
		textSize: size,
	})
	const Tag = as ?? "span"
	return (
		<Tag
			className={cx(styles.inline, className)}
			style={{
				fontSize: size ? undefined : "inherit",
				...colorStyle(color),
				...style,
			}}
			{...rest}
		/>
	)
}
TypographyInline.displayName = "Typography.Inline"

// ── Export ────────────────────────────────────────────────────────────────────

export const Typography = {
	Text: TypographyText,
	Heading: TypographyHeading,
	Inline: TypographyInline,
}
