import { Link } from "@tanstack/react-router"
import {
	cloneElement,
	createContext,
	isValidElement,
	type ReactElement,
	type ReactNode,
	type RefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react"
import { match } from "ts-pattern"
import { css, cx } from "../../../styles/styled-system/css"

export type Placement =
	| "bottom-start"
	| "bottom-end"
	| "top-start"
	| "top-end"
	| "left"
	| "right"
export type Position = { top: number; left: number; transform: string }
type OpenOn = "click" | "contextmenu"

type MenuContextType = {
	open: boolean
	setOpen: (v: boolean) => void
	toggleOpen: () => void
	triggerRef: RefObject<HTMLElement>
	contentRef: RefObject<HTMLDivElement>
	position: Position | null
	placement: Placement
	openOn: OpenOn
}

const MenuContext = createContext<MenuContextType | null>(null)
export function useMenu() {
	const ctx = useContext(MenuContext)
	if (!ctx) throw new Error("useMenu must be used within <Menu>")
	return ctx
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
			left: trigger.left + window.scrollX - content.width - OFFSET,
			transform: "translateY(0)",
		}))
		.with("right", () => ({
			top: trigger.top + window.scrollY,
			left: trigger.right + window.scrollX + OFFSET,
			transform: "translateY(0)",
		}))
		.exhaustive()
}

export type MenuProps = {
	children: ReactNode
	placement?: Placement
	openOn?: OpenOn
}

export function Menu({
	children,
	placement = "bottom-end",
	openOn = "click",
}: MenuProps) {
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
		setPosition(getPlacementCoords(placement, triggerRect, contentRect))
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
		<MenuContext.Provider
			value={{
				open,
				setOpen,
				toggleOpen,
				triggerRef,
				contentRef,
				position,
				placement,
				openOn,
			}}
		>
			{children}
		</MenuContext.Provider>
	)
}

Menu.Trigger = function MenuTrigger({
	children,
	asChild = false,
	className,
}: {
	children: ReactNode
	asChild?: boolean
	className?: string
}) {
	const { toggleOpen, openOn, triggerRef } = useMenu()

	if (!isValidElement(children)) {
		throw new Error("Trigger expects a single valid React element")
	}

	const child = children as ReactElement<any>
	const eventProps =
		openOn === "contextmenu"
			? {
					onContextMenu: (e: React.MouseEvent) => {
						e.preventDefault()
						e.stopPropagation()
						toggleOpen()
						child.props.onContextMenu?.(e)
					},
				}
			: {
					onClick: (e: React.MouseEvent) => {
						e.preventDefault()
						e.stopPropagation()
						toggleOpen()
						child.props.onClick?.(e)
					},
				}

	if (asChild) {
		return cloneElement(child, {
			ref: triggerRef,
			className: cx(child.props.className, className),
			...eventProps,
		})
	}

	const Tag = openOn === "contextmenu" ? "div" : "button"
	const defaultProps: any =
		openOn === "contextmenu"
			? { style: { display: "inline-block" } }
			: { type: "button" }

	return (
		<Tag
			ref={triggerRef as RefObject<any>}
			className={className}
			{...defaultProps}
			{...eventProps}
		>
			{children}
		</Tag>
	)
}

Menu.Content = function MenuContent({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	const { open, contentRef, position } = useMenu()
	return (
		<div
			ref={contentRef}
			role="menu"
			inert={!open}
			className={cx(
				css({
					position: "absolute",
					bg: "neutral.0",
					border: "1px solid",
					borderColor: "neutral.300",
					boxShadow: "lg",
					py: "sm",
					borderRadius: "md",
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

Menu.Item = function MenuItem({
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
	const { setOpen } = useMenu()
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
					px: "md",
					py: "sm",
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

Menu.Link = function MenuLink({
	children,
	to,
	className,
	closeOnSelect = true,
}: {
	children: ReactNode
	to: string
	className?: string
	closeOnSelect?: boolean
}) {
	const { setOpen } = useMenu()
	return (
		<Link
			to={to}
			onClick={(e) => {
				e.stopPropagation()
				if (closeOnSelect) setOpen(false)
			}}
			className={cx(
				css({
					display: "block",
					px: "md",
					py: "sm",
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
		</Link>
	)
}

Menu.Separator = function MenuSeparator({ className }: { className?: string }) {
	return (
		<hr
			className={cx(
				css({ height: "1px", color: "neutral.200", my: "sm", mx: "sm" }),
				className,
			)}
		/>
	)
}
