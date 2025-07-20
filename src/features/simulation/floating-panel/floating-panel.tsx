import type { ReactNode } from "react"
import { css, cx } from "../../../styles/styled-system/css"
import { Card } from "../../ui/card"

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
		<Card
			className={cx(
				css({
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
		</Card>
	)
}

FloatingPanel.Description = Card.Description
FloatingPanel.Header = Card.Header
FloatingPanel.Action = Card.Action
FloatingPanel.Content = Card.Content
FloatingPanel.Footer = Card.Footer
FloatingPanel.Title = Card.Title
