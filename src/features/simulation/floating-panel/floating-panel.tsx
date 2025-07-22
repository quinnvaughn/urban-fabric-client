import type { ReactNode } from "react"
import { css, cx } from "../../../styles/styled-system/css"

type Props = {
	children: ReactNode
	className?: string
	top: number
	left?: number
	right?: number
	width: number
	maxHeightOffset: number
}

export function FloatingPanel({
	children,
	className,
	top,
	left,
	right,
	width,
	maxHeightOffset,
}: Props) {
	return (
		<div
			className={cx(
				css({
					borderWidth: "1px",
					borderColor: "neutral.200",
					borderRadius: "lg",
					bg: "neutral.0",
					p: "md",
					boxShadow: "md",
					position: "absolute",
					overflowY: "auto",
				}),
				className,
			)}
			style={{
				top,
				left,
				right,
				width,
				maxHeight: `calc(100vh - ${maxHeightOffset}px)`,
			}}
		>
			{children}
		</div>
	)
}
