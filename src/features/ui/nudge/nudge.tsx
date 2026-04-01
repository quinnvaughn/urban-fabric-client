import { X } from "lucide-react"
import * as React from "react"
import { Button } from "../button"
import { Card } from "../card"
import { HStack } from "../layout"
import { Typography } from "../typography"

// ---------- Types ----------

export interface NudgeAnchor {
	x?: "left" | "center" | "right"
	y?: "top" | "bottom"
}

export interface NudgeOffset {
	x?: number
	y?: number
}

// ---------- Position resolver ----------

function resolvePosition(
	anchor: NudgeAnchor,
	offset: NudgeOffset,
): React.CSSProperties {
	const { x = "left", y = "bottom" } = anchor
	const ox = offset.x ?? 16
	const oy = offset.y ?? 24

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

// ---------- Context ----------

interface NudgeContextValue {
	dismiss: () => void
}

const NudgeContext = React.createContext<NudgeContextValue | null>(null)

function useNudgeContext() {
	const ctx = React.useContext(NudgeContext)
	if (!ctx) throw new Error("Nudge slots must be used within <Nudge>")
	return ctx
}

// ---------- Root ----------

export interface NudgeRootProps {
	anchor?: NudgeAnchor
	offset?: NudgeOffset
	onDismiss?: () => void
	className?: string
	style?: React.CSSProperties
	children: React.ReactNode
}

function NudgeRoot({
	anchor = { x: "left", y: "bottom" },
	offset = {},
	onDismiss,
	className,
	style,
	children,
}: NudgeRootProps) {
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

	const isCentered = (anchor.x ?? "left") === "center"

	return (
		<NudgeContext.Provider value={{ dismiss }}>
			<Card
				size="sm"
				shadow="lg"
				variant="elevated"
				style={{
					position: "fixed",
					width: 296,
					zIndex: "var(--z-index-floating)" as React.CSSProperties["zIndex"],
					pointerEvents: closing ? "none" : "auto",
					...resolvePosition(anchor, offset),
					animation: closing
						? `${isCentered ? "nudgeOutCenter" : "nudgeOut"} 0.18s cubic-bezier(0.4,0,0.2,1) forwards`
						: `${isCentered ? "nudgeInCenter" : "nudgeIn"} 0.32s cubic-bezier(0.16,1,0.3,1) both`,
					...style,
				}}
				className={className}
			>
				{children}
			</Card>
		</NudgeContext.Provider>
	)
}

// ---------- Header ----------

export interface NudgeHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	label?: string
}

function NudgeHeader({
	label,
	children,
	className,
	...rest
}: NudgeHeaderProps) {
	return (
		<Card.Header className={className} {...rest}>
			<HStack justify="space-between" align="center" gap="2">
				{label && (
					<Typography.Text
						size="3xs"
						weight="semibold"
						transform="uppercase"
						letterSpacing="wider"
						color="stone.500"
					>
						{label}
					</Typography.Text>
				)}
				{children}
			</HStack>
		</Card.Header>
	)
}
NudgeHeader.displayName = "Nudge.Header"

function NudgeTitle({
	className,
	...rest
}: Omit<React.HTMLAttributes<HTMLElement>, "color">) {
	return (
		<Typography.Text
			size="sm"
			weight="semibold"
			color="fg.default"
			lineHeight="snug"
			letterSpacing="snug"
			className={className}
			{...rest}
		/>
	)
}
NudgeTitle.displayName = "Nudge.Title"

// ---------- Body ----------

function NudgeBody({
	className,
	...rest
}: React.HTMLAttributes<HTMLDivElement>) {
	return <Card.Body className={className} {...rest} />
}
NudgeBody.displayName = "Nudge.Body"

function NudgeDescription({
	className,
	...rest
}: Omit<React.HTMLAttributes<HTMLElement>, "color">) {
	return (
		<Typography.Text
			size="sm"
			color="fg.muted"
			className={className}
			{...rest}
		/>
	)
}

NudgeDescription.displayName = "Nudge.Description"

// ---------- Footer ----------

function NudgeFooter({
	className,
	...rest
}: React.HTMLAttributes<HTMLDivElement>) {
	return <Card.Footer className={className} {...rest} />
}
NudgeFooter.displayName = "Nudge.Footer"

// ---------- CloseButton ----------

function NudgeCloseButton({
	onClick,
	...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const { dismiss } = useNudgeContext()
	return (
		<Button
			appearance="ghost"
			intent="neutral"
			size="xs"
			onClick={onClick ?? dismiss}
			aria-label="Dismiss"
			{...rest}
		>
			<X size={14} />
		</Button>
	)
}
NudgeCloseButton.displayName = "Nudge.CloseButton"

// ---------- Dot-notation export ----------

export const Nudge = Object.assign(NudgeRoot, {
	Header: NudgeHeader,
	Title: NudgeTitle,
	Body: NudgeBody,
	Description: NudgeDescription,
	Footer: NudgeFooter,
	CloseButton: NudgeCloseButton,
})
