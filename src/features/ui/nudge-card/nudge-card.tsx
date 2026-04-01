import { X } from "lucide-react"
import * as React from "react"
import { css, cx } from "@/styles/styled-system/css"
import { Button } from "../button"
import { Card } from "../card"
import { Typography } from "../typography"

// ---------- Types ----------

export interface NudgeCardAnchor {
	x?: "left" | "center" | "right"
	y?: "top" | "bottom"
}

export interface NudgeCardAction {
	label: string
	onClick: () => void
}

export interface NudgeCardProps {
	title: string
	description?: string
	primaryAction: NudgeCardAction
	secondaryAction?: NudgeCardAction
	anchor?: NudgeCardAnchor
	offset?: { x?: number; y?: number }
	onDismiss?: () => void
	className?: string
}

// ---------- Position resolver ----------

function resolvePosition(
	anchor: NudgeCardAnchor,
	offset: { x?: number; y?: number },
): React.CSSProperties {
	const { x = "left", y = "bottom" } = anchor
	const ox = offset.x ?? 16
	const oy = offset.y ?? 52

	const vertical: React.CSSProperties =
		y === "bottom" ? { bottom: oy } : { top: oy }

	const horizontal: React.CSSProperties =
		x === "center"
			? { left: "50%", transform: "translateX(-50%)" }
			: x === "right"
				? { right: ox }
				: { left: ox }

	return { ...vertical, ...horizontal }
}

// ---------- Component ----------

export function NudgeCard({
	title,
	description,
	primaryAction,
	secondaryAction,
	anchor = { x: "center", y: "bottom" },
	offset = {},
	onDismiss,
	className,
}: NudgeCardProps) {
	const [closing, setClosing] = React.useState(false)
	const [gone, setGone] = React.useState(false)

	const dismiss = React.useCallback(() => {
		setClosing(true)
		setTimeout(() => {
			setGone(true)
			onDismiss?.()
		}, 180)
	}, [onDismiss])

	if (gone) return null

	const positionStyle: React.CSSProperties = {
		position: "fixed",
		...resolvePosition(anchor, offset),
		width: 264,
		zIndex: "var(--z-index-floating)" as React.CSSProperties["zIndex"],
		animation: closing
			? "nudgeOut 0.18s cubic-bezier(0.4,0,0.2,1) forwards"
			: "nudgeIn 0.32s cubic-bezier(0.16,1,0.3,1) both",
		pointerEvents: closing ? "none" : "auto",
	}

	// When centered, the entry/exit animation should be vertical only —
	// but we also need to preserve the translateX(-50%) for centering.
	// We swap to a combined transform animation for center anchors.
	const isCentered = (anchor.x ?? "left") === "center"

	return (
		<Card
			shadow="lg"
			variant="elevated"
			size="sm"
			style={{
				...positionStyle,
				animation: closing
					? `${isCentered ? "nudgeOutCenter" : "nudgeOut"} 0.18s cubic-bezier(0.4,0,0.2,1) forwards`
					: `${isCentered ? "nudgeInCenter" : "nudgeIn"} 0.32s cubic-bezier(0.16,1,0.3,1) both`,
			}}
			className={cx(
				css({ display: "flex", flexDirection: "column", gap: "3" }),
				className,
			)}
		>
			{/* Header row: title + dismiss */}
			<Card.Header
				className={css({
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					gap: "2",
					border: "none",
					pb: "0",
				})}
			>
				<Typography.Text
					size="sm"
					weight="semibold"
					color="fg.default"
					lineHeight="snug"
					letterSpacing="snug"
				>
					{title}
				</Typography.Text>
				{onDismiss && (
					<Button
						appearance="ghost"
						intent="neutral"
						size="xs"
						onClick={dismiss}
					>
						<X size={16} />
					</Button>
				)}
			</Card.Header>

			{/* Description */}
			{description && (
				<Card.Body
					className={css({
						py: "0",
					})}
				>
					<Typography.Text size="sm" color="fg.muted">
						{description}
					</Typography.Text>
				</Card.Body>
			)}

			{/* Actions */}
			<Card.Footer
				className={css({
					flexDirection: "column",
					gap: "1.5",
					border: "none",
					pt: "0",
				})}
			>
				<Button
					appearance="solid"
					size="sm"
					style={{ width: "100%" }}
					onClick={primaryAction.onClick}
				>
					{primaryAction.label}
				</Button>

				{secondaryAction && (
					<button
						type="button"
						onClick={() => {
							secondaryAction.onClick()
							dismiss()
						}}
						className={css({
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							w: "full",
							h: "7",
							border: "none",
							background: "transparent",
							color: "fg.subtle",
							fontSize: "xs",
							fontFamily: "sans",
							cursor: "pointer",
							transition: "colors",
							_hover: { color: "fg.default" },
						})}
					>
						{secondaryAction.label}
					</button>
				)}
			</Card.Footer>
		</Card>
	)
}
