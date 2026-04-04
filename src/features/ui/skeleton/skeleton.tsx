import { css, cx } from "#/styles/styled-system/css"

type SkeletonBaseProps = React.HTMLAttributes<HTMLDivElement> & {
	width?: string | number
	height?: string | number
	borderRadius?: string
}

type SkeletonCircleProps = Omit<SkeletonBaseProps, "borderRadius"> & {
	size?: string | number
}

type SkeletonLineProps = SkeletonBaseProps

function toCssSize(value?: string | number) {
	return typeof value === "number" ? `${value}px` : value
}

function SkeletonRoot({
	width,
	height,
	borderRadius = "var(--radius-sm)",
	className,
	style,
	...rest
}: SkeletonBaseProps) {
	return (
		<div
			aria-hidden="true"
			className={cx(
				css({
					flexShrink: 0,
					background:
						"linear-gradient(90deg, var(--colors-stone-200) 25%, var(--colors-stone-100) 50%, var(--colors-stone-200) 75%)",
					backgroundSize: "600px 100%",
					animation: "shimmer 1.4s linear infinite",
					_motionReduce: {
						animation: "none",
					},
				}),
				className,
			)}
			style={{
				width: toCssSize(width),
				height: toCssSize(height),
				borderRadius,
				...style,
			}}
			{...rest}
		/>
	)
}

function Circle({
	size = 40,
	width,
	height,
	...rest
}: SkeletonCircleProps) {
	const resolvedSize = toCssSize(size)

	return (
		<SkeletonRoot
			width={width ?? resolvedSize}
			height={height ?? resolvedSize}
			borderRadius="9999px"
			{...rest}
		/>
	)
}

function Line({ width = "100%", height = 12, ...rest }: SkeletonLineProps) {
	return <SkeletonRoot width={width} height={height} {...rest} />
}

export const Skeleton = Object.assign(SkeletonRoot, {
	Circle,
	Line,
})
