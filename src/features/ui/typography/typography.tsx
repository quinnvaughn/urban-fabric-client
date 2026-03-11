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
type Leading = NonNullable<TypographyVariantProps["leading"]>
type Tracking = NonNullable<TypographyVariantProps["tracking"]>
type Transform = NonNullable<TypographyVariantProps["transform"]>
type Clamp = NonNullable<TypographyVariantProps["clamp"]>
type Color = ColorToken

function colorStyle(color?: Color): React.CSSProperties | undefined {
	if (!color) return undefined
	return { color: `var(--colors-${color.replace(/\./g, "-")})` }
}

// ── Text ──────────────────────────────────────────────────────────────────────

type TextSize = Extract<NonNullable<TypographyVariantProps["textSize"]>, string>

const TEXT_ELEMENT_MAP: Record<TextSize, React.ElementType> = {
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
	leading?: Leading
	tracking?: Tracking
	transform?: Transform
	color?: Color
	clamp?: Clamp
	italic?: boolean
	truncate?: boolean
}

function TypographyText({
	as,
	size = "md",
	weight,
	tone,
	font,
	leading,
	tracking,
	transform,
	color,
	italic,
	className,
	style,
	clamp,
	truncate,
	...rest
}: TextProps) {
	const styles = typography({
		textSize: size,
		weight,
		tone,
		font,
		clamp,
		leading,
		tracking,
		transform,
		truncate,
	})
	const Tag = as ?? TEXT_ELEMENT_MAP[size]
	return (
		<Tag
			className={cx(styles.text, className)}
			style={{
				fontStyle: italic ? "italic" : undefined,
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
	leading?: Leading
	tracking?: Tracking
	transform?: Transform
	color?: Color
	italic?: boolean
}

function TypographyHeading({
	as,
	size = "md",
	weight,
	tone,
	font,
	leading,
	tracking,
	transform,
	color,
	italic,
	className,
	style,
	...rest
}: HeadingProps) {
	const styles = typography({
		headingSize: size,
		weight,
		tone,
		font,
		leading,
		tracking,
		transform,
	})
	const Tag = as ?? HEADING_ELEMENT_MAP[size]
	return (
		<Tag
			className={cx(styles.heading, className)}
			style={{
				fontStyle: italic ? "italic" : undefined,
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
	italic?: boolean
	weight?: Weight
	tone?: Tone
	color?: Color
	tracking?: Tracking
	transform?: Transform
}

function TypographyInline({
	as,
	italic,
	weight,
	tone,
	color,
	tracking,
	transform,
	className,
	style,
	...rest
}: InlineProps) {
	const styles = typography({ weight, tone, tracking, transform })
	const Tag = as ?? "span"
	return (
		<Tag
			className={cx(styles.inline, className)}
			style={{
				fontStyle: italic ? "italic" : undefined,
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
