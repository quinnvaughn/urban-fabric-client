import { createLink, type LinkComponent } from "@tanstack/react-router"
import {
	cloneElement,
	createContext,
	isValidElement,
	type JSX,
	type ReactElement,
	type ReactNode,
	type RefObject,
	useCallback,
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
	isControlled: boolean
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
	open?: boolean
	onOpenChange?: (v: boolean) => void
}

export function Menu({
	children,
	placement = "bottom-end",
	openOn = "click",
	open: controlledOpen,
	onOpenChange,
}: MenuProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
	const isControlled = controlledOpen !== undefined
	const open = isControlled ? controlledOpen : uncontrolledOpen
	const _setOpen =
		isControlled && onOpenChange ? onOpenChange : setUncontrolledOpen

	const toggleOpen = () => _setOpen(!open)
	const closeMenu = useCallback(() => {
		_setOpen(false)
	}, [_setOpen])
	const [position, setPosition] = useState<Position | null>(null)
	// biome-ignore lint/style/noNonNullAssertion: we ensure these refs are set before use
	const triggerRef = useRef<HTMLElement>(null!)
	// biome-ignore lint/style/noNonNullAssertion: we ensure these refs are set before use
	const contentRef = useRef<HTMLDivElement>(null!)

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
			closeMenu() // <-- force close, not toggle
		}
		document.addEventListener("mousedown", handleClick)
		return () => document.removeEventListener("mousedown", handleClick)
	}, [closeMenu])

	return (
		<MenuContext.Provider
			value={{
				open,
				setOpen: _setOpen,
				toggleOpen,
				triggerRef,
				contentRef,
				position,
				placement,
				openOn,
				isControlled,
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
	const { toggleOpen, openOn, triggerRef, isControlled } = useMenu()

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
						if (!isControlled) toggleOpen()
						child.props.onContextMenu?.(e)
					},
				}
			: {
					onClick: (e: React.MouseEvent) => {
						e.preventDefault()
						e.stopPropagation()
						if (!isControlled) toggleOpen()
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
					bg: open ? "neutral.0" : "transparent",
					border: "1px solid",
					borderColor: open ? "neutral.300" : "transparent",
					boxShadow: open ? "lg" : "none",
					py: "sm",
					borderRadius: "md",
					minWidth: "160px",
					zIndex: 20,
					opacity: open ? 1 : 0,
					visibility: open ? "visible" : "hidden",
					transition: "opacity 150ms ease",
				}),
				className,
			)}
			style={{
				top: position?.top,
				left: position?.left,
				transform: position?.transform,
			}}
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
				e.preventDefault()
				e.stopPropagation()
				onSelect?.(e)
				if (closeOnSelect) setOpen(false)
			}}
			className={cx(
				css({
					px: "md", // Use larger padding for inset items
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
			<span
				className={css({
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					width: "100%",
				})}
			>
				{children}
			</span>
		</button>
	)
}

Menu.Shortcut = function MenuShortcut({ children }: { children: ReactNode }) {
	return (
		<span
			className={css({
				color: "neutral.500",
				fontSize: "sm",
				marginLeft: "auto",
			})}
		>
			{children}
		</span>
	)
}

const BaseMenuLink = ({
	className,
	children,
	...rest
}: JSX.IntrinsicElements["a"] & { closeOnSelect?: boolean }) => {
	return (
		<a
			{...rest}
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
		</a>
	)
}

const MenuLinkInternal = createLink(BaseMenuLink)

const AppLink: LinkComponent<typeof BaseMenuLink> = (props) => {
	const { setOpen } = useMenu()
	return (
		<MenuLinkInternal
			preload="intent"
			onClick={(e) => {
				e.stopPropagation()
				props.onClick?.(e)
				if (props.closeOnSelect !== false) {
					setOpen(false)
				}
			}}
			{...props}
		/>
	)
}

Menu.Link = AppLink

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
