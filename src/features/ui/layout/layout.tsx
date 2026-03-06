import type { SpacingToken } from "#/styles/styled-system/tokens"
import { css, cx } from "@/styles/styled-system/css"
import type {
	SystemProperties,
	SystemStyleObject,
} from "@/styles/styled-system/types"

// ---------- Types ----------

type AlignItems = SystemProperties["alignItems"]
type JustifyContent = SystemProperties["justifyContent"]
type GridCols = SystemProperties["gridTemplateColumns"]

// ---------- Box ----------
// Generic div that accepts any Panda style props as an escape hatch.

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
	as?: React.ElementType
	sx?: SystemStyleObject
}

export function Box({ as: Tag = "div", sx, className, ...rest }: BoxProps) {
	return <Tag className={cx(sx ? css(sx) : undefined, className)} {...rest} />
}

// ---------- VStack ----------
// Vertical flex column.

export interface VStackProps extends React.HTMLAttributes<HTMLDivElement> {
	gap?: SpacingToken
	align?: AlignItems
	justify?: JustifyContent
	fullWidth?: boolean
}

export function VStack({
	gap = "4",
	align = "stretch",
	justify = "start",
	fullWidth = false,
	className,
	...rest
}: VStackProps) {
	return (
		<div
			className={cx(
				css({
					display: "flex",
					flexDirection: "column",
					gap,
					alignItems: align,
					justifyContent: justify,
					width: fullWidth ? "full" : undefined,
				}),
				className,
			)}
			{...rest}
		/>
	)
}

// ---------- HStack ----------
// Horizontal flex row.

export interface HStackProps extends React.HTMLAttributes<HTMLDivElement> {
	gap?: SpacingToken
	align?: AlignItems
	justify?: JustifyContent
	wrap?: boolean
	fullWidth?: boolean
}

export function HStack({
	gap = "4",
	align = "center",
	justify = "start",
	wrap = false,
	fullWidth = false,
	className,
	...rest
}: HStackProps) {
	return (
		<div
			className={cx(
				css({
					display: "flex",
					flexDirection: "row",
					gap,
					alignItems: align,
					justifyContent: justify,
					flexWrap: wrap ? "wrap" : "nowrap",
					width: fullWidth ? "full" : undefined,
				}),
				className,
			)}
			{...rest}
		/>
	)
}

// ---------- Grid ----------

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
	cols?: GridCols
	gap?: SpacingToken
	gapX?: SpacingToken
	gapY?: SpacingToken
	align?: SystemProperties["alignItems"]
	justify?: SystemProperties["justifyItems"]
}

export function Grid({
	cols = 1,
	gap,
	gapX,
	gapY,
	align,
	justify,
	className,
	...rest
}: GridProps) {
	return (
		<div
			className={cx(
				css({
					display: "grid",
					gridTemplateColumns: cols,
					gap,
					columnGap: gapX,
					rowGap: gapY,
					alignItems: align,
					justifyItems: justify,
				}),
				className,
			)}
			{...rest}
		/>
	)
}
