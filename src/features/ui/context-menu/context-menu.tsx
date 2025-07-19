// context-menu.tsx
import {
	cloneElement,
	createContext,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react"
import { match } from "ts-pattern"
import { css, cx } from "../../../styles/styled-system/css"

type Placement =
	| "bottom-start"
	| "bottom-end"
	| "top-start"
	| "top-end"
	| "left"
	| "right"

type Position = {
	top: number
	left: number
	transform: string
}

type ContextMenuContextType = {
	open: boolean
	setOpen: (v: boolean) => void
	toggleOpen: () => void
	triggerRef: React.RefObject<HTMLElement>
	contentRef: React.RefObject<HTMLDivElement>
	position: Position | null
	placement: Placement
}

const ContextMenuContext = createContext<ContextMenuContextType | null>(null)
const useContextMenu = () => {
	const ctx = useContext(ContextMenuContext)
	if (!ctx) throw new Error("Must be used within <ContextMenu>")
	return ctx
}

export function ContextMenu({
	children,
	placement = "bottom-end",
}: {
	children: ReactNode
	placement?: Placement
}) {
	const [open, setOpen] = useState(false)
	const [position, setPosition] = useState<Position | null>(null)
	// biome-ignore lint/style/noNonNullAssertion: we ensure these refs are set before use
	const triggerRef = useRef<HTMLElement>(null!)
	// biome-ignore lint/style/noNonNullAssertion: we ensure these refs are set before use
	const contentRef = useRef<HTMLDivElement>(null!)

	const toggleOpen = () => setOpen((v) => !v)

	// Measure on open
	useEffect(() => {
		if (!open || !triggerRef.current || !contentRef.current) return

		const triggerRect = triggerRef.current.getBoundingClientRect()
		const contentRect = contentRef.current.getBoundingClientRect()

		const coords = getPlacementCoords(placement, triggerRect, contentRect)
		setPosition(coords)
	}, [open, placement])

	// Close on outside click
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (
				triggerRef.current?.contains(e.target as Node) ||
				contentRef.current?.contains(e.target as Node)
			)
				return
			setOpen(false)
		}
		document.addEventListener("mousedown", handleClick)
		return () => document.removeEventListener("mousedown", handleClick)
	}, [])

	return (
		<ContextMenuContext.Provider
			value={{
				open,
				setOpen,
				toggleOpen,
				triggerRef,
				contentRef,
				position,
				placement,
			}}
		>
			{children}
		</ContextMenuContext.Provider>
	)
}

ContextMenu.Trigger = function ContextMenuTrigger({
	children,
	asChild = false,
	className,
}: {
	children: ReactNode
	asChild?: boolean
	className?: string
}) {
	const { toggleOpen, triggerRef } = useContextMenu()

	if (!isValidElement(children)) {
		throw new Error("Trigger expects a single valid React element")
	}

	if (asChild) {
		// biome-ignore lint/suspicious/noExplicitAny: we know children is a ReactElement
		const child = children as ReactElement<any>
		return cloneElement(child, {
			ref: triggerRef,
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation()
				toggleOpen()
				child.props.onClick?.(e)
			},
		})
	}

	return (
		<button
			ref={triggerRef as React.RefObject<HTMLButtonElement>}
			type="button"
			className={className}
			onClick={(e) => {
				e.stopPropagation()
				toggleOpen()
			}}
		>
			{children}
		</button>
	)
}

ContextMenu.Content = function ContextMenuContent({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	const { open, contentRef, position } = useContextMenu()

	return (
		<div
			ref={contentRef}
			inert={!open}
			role="menu"
			className={cx(
				css({
					position: "absolute",
					bg: "neutral.0",
					boxShadow: "md",
					py: "xs",
					borderRadius: "sm",
					minWidth: "160px",
					zIndex: 20,
					opacity: open ? 1 : 0,
					visibility: open ? "visible" : "hidden",
					transition:
						"opacity 150ms ease, transform 150ms ease, visibility 150ms",
				}),
				className,
			)}
			style={
				position
					? {
							top: position.top,
							left: position.left,
							transform: position.transform,
						}
					: undefined
			}
		>
			{children}
		</div>
	)
}

ContextMenu.Item = function ContextMenuItem({
	children,
	onSelect,
	className,
	closeOnSelect = true,
}: {
	children: ReactNode
	onSelect?: (e: React.MouseEvent) => void
	className?: string
	closeOnSelect?: boolean
}) {
	const { setOpen } = useContextMenu()

	return (
		<button
			role="menuitem"
			type="button"
			onClick={(e) => {
				e.stopPropagation()
				onSelect?.(e)
				if (closeOnSelect) setOpen(false)
			}}
			className={cx(
				css({
					px: "sm",
					py: "xs",
					textAlign: "left",
					width: "100%",
					fontSize: "sm",
					color: "neutral.900",
					cursor: "pointer",
					_hover: { bg: "neutral.100" },
				}),
				className,
			)}
		>
			{children}
		</button>
	)
}

ContextMenu.Separator = function ContextMenuSeparator({
	className,
}: {
	className?: string
}) {
	const separatorStyles = css({
		height: "1px",
		color: "neutral.200",
		my: "xs",
	})
	return <hr className={cx(separatorStyles, className)} />
}

const OFFSET = 8

function getPlacementCoords(
	placement: Placement,
	trigger: DOMRect,
	content: DOMRect,
): Position {
	return match(placement)
		.with("bottom-start", () => ({
			top: trigger.bottom + window.scrollY + OFFSET,
			left: trigger.left + window.scrollX,
			transform: "translateY(0)",
		}))
		.with("bottom-end", () => ({
			top: trigger.bottom + window.scrollY + OFFSET,
			left: trigger.right + window.scrollX - content.width,
			transform: "translateY(0)",
		}))
		.with("top-start", () => ({
			top: trigger.top + window.scrollY - content.height - OFFSET,
			left: trigger.left + window.scrollX,
			transform: "translateY(0)",
		}))
		.with("top-end", () => ({
			top: trigger.top + window.scrollY - content.height - OFFSET,
			left: trigger.right + window.scrollX - content.width,
			transform: "translateY(0)",
		}))
		.with("left", () => ({
			top: trigger.top + window.scrollY,
			left: trigger.left + window.scrollX - content.width,
			transform: "translateY(0)",
		}))
		.with("right", () => ({
			top: trigger.top + window.scrollY,
			left: trigger.right + window.scrollX,
			transform: "translateY(0)",
		}))
		.exhaustive()
}
