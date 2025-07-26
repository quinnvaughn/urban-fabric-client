import { type ReactNode, useState } from "react"
import { css, cx } from "../../../styles/styled-system/css"
import { Flex, Typography } from "../../ui"
import { IconButton } from "../../ui/icon-button"

type Props = {
	children: ReactNode
	className?: string
	top: number
	left?: number
	right?: number
	width: number
	maxHeightOffset: number
	header: ReactNode
}

export function FloatingPanel({
	children,
	className,
	top,
	left,
	right,
	width,
	header,
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
					display: "flex",
					flexDirection: "column",
					rowGap: "md",
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
			{header}
			{children}
		</div>
	)
}
