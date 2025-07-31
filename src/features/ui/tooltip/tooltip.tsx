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

export type TooltipPlacement =
	| "top"
	| "bottom"
	| "left"
	| "right"
	| "top-start"
	| "top-end"
	| "bottom-start"
	| "bottom-end"

type Position = { top: number; left: number; transform: string }

type TooltipContextType = {
	open: boolean
	setOpen: (v: boolean) => void
	triggerRef: RefObject<HTMLElement>
	contentRef: RefObject<HTMLDivElement>
	position: Position | null
	placement: TooltipPlacement
	delay: number
}

const TooltipContext = createContext<TooltipContextType | null>(null)
export function useTooltip() {
	const ctx = useContext(TooltipContext)
	if (!ctx) throw new Error("useTooltip must be used within <Tooltip>")
	return ctx
}

const OFFSET = 6

function getTooltipCoords(
	placement: TooltipPlacement,
	trigger: DOMRect,
	content: DOMRect,
): Position {
	return match(placement)
		.with("bottom", () => ({
			top: trigger.bottom + window.scrollY + OFFSET,
			left:
				trigger.left + window.scrollX + trigger.width / 2 - content.width / 2,
			transform: "translateY(0)",
		}))
		.with("top", () => ({
			top: trigger.top + window.scrollY - content.height - OFFSET,
			left:
				trigger.left + window.scrollX + trigger.width / 2 - content.width / 2,
			transform: "translateY(0)",
		}))
		.with("left", () => ({
			top:
				trigger.top + window.scrollY + trigger.height / 2 - content.height / 2,
			left: trigger.left + window.scrollX - content.width - OFFSET,
			transform: "translateY(0)",
		}))
		.with("right", () => ({
			top:
				trigger.top + window.scrollY + trigger.height / 2 - content.height / 2,
			left: trigger.right + window.scrollX + OFFSET,
			transform: "translateY(0)",
		}))
		.otherwise(() => ({
			top: trigger.bottom + window.scrollY + OFFSET,
			left: trigger.left + window.scrollX,
			transform: "translateY(0)",
		}))
}

export type TooltipProps = {
	children: ReactNode
	placement?: TooltipPlacement
	open?: boolean
	onOpenChange?: (v: boolean) => void
	delay?: number
}

export function Tooltip({
	children,
	placement = "top",
	open: controlledOpen,
	onOpenChange,
	delay = 150,
}: TooltipProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
	const isControlled = controlledOpen !== undefined
	const open = isControlled ? controlledOpen : uncontrolledOpen
	const _setOpen =
		isControlled && onOpenChange ? onOpenChange : setUncontrolledOpen

	const triggerRef = useRef<HTMLElement>(null!)
	const contentRef = useRef<HTMLDivElement>(null!)
	const [position, setPosition] = useState<Position | null>(null)

	// Compute coords
	useEffect(() => {
		if (!open || !triggerRef.current || !contentRef.current) return
		const triggerRect = triggerRef.current.getBoundingClientRect()
		const contentRect = contentRef.current.getBoundingClientRect()
		setPosition(getTooltipCoords(placement, triggerRect, contentRect))
	}, [open, placement])

	return (
		<TooltipContext.Provider
			value={{
				open,
				setOpen: _setOpen,
				triggerRef,
				contentRef,
				position,
				placement,
				delay,
			}}
		>
			{children}
		</TooltipContext.Provider>
	)
}

Tooltip.Trigger = function TooltipTrigger({
	children,
	asChild = false,
	className,
}: {
	children: ReactNode
	asChild?: boolean
	className?: string
}) {
	const { setOpen, triggerRef, delay } = useTooltip()
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	if (!isValidElement(children)) {
		throw new Error("Tooltip.Trigger expects a valid React element")
	}

	const show = () => {
		timeoutRef.current = setTimeout(() => setOpen(true), delay)
	}
	const hide = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		setOpen(false)
	}

	const props = {
		onMouseEnter: show,
		onMouseLeave: hide,
		onFocus: show,
		onBlur: hide,
	}

	if (asChild) {
		return cloneElement(children as ReactElement, {
			ref: triggerRef,
			className: cx(children.props.className, className),
			...props,
		})
	}

	return (
		<span ref={triggerRef} className={className} {...props}>
			{children}
		</span>
	)
}

Tooltip.Content = function TooltipContent({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	const { open, contentRef, position } = useTooltip()
	return (
		<div
			ref={contentRef}
			role="tooltip"
			className={cx(
				css({
					position: "absolute",
					bg: "neutral.900",
					color: "neutral.0",
					fontSize: "xs",
					px: "sm",
					py: "2xs",
					borderRadius: "sm",
					whiteSpace: "nowrap",
					pointerEvents: "none",
					zIndex: 30,
					opacity: open ? 1 : 0,
					visibility: open ? "visible" : "hidden",
					transition: "opacity 100ms ease",
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
