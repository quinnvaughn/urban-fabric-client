import * as React from "react"
import * as ReactDOM from "react-dom"
import { css, cx } from "@/styles/styled-system/css"

// ---------- Types ----------

export type TooltipPlacement =
	| "top"
	| "top-start"
	| "top-end"
	| "bottom"
	| "bottom-start"
	| "bottom-end"
	| "left"
	| "right"

const GAP = 6 // px between trigger and tooltip

// ---------- Context ----------

interface TooltipContextValue {
	open: boolean
	setOpen: (open: boolean) => void
	triggerRef: React.RefObject<HTMLElement | null>
	placement: TooltipPlacement
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null)

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
	return (node: T) => {
		for (const ref of refs) {
			if (!ref) continue
			if (typeof ref === "function") {
				ref(node)
			} else {
				;(ref as React.MutableRefObject<T>).current = node
			}
		}
	}
}

function useTooltipContext() {
	const ctx = React.useContext(TooltipContext)
	if (!ctx)
		throw new Error(
			"Tooltip.Trigger and Tooltip.Content must be used within <Tooltip>",
		)
	return ctx
}

// ---------- Root ----------

export interface TooltipRootProps {
	children: React.ReactNode
	placement?: TooltipPlacement
	/** Delay before showing, in ms. Default: 400 */
	delayMs?: number
}

function TooltipRoot({
	children,
	placement = "top",
	delayMs = 400,
}: TooltipRootProps) {
	const [open, setOpenState] = React.useState(false)
	const triggerRef = React.useRef<HTMLElement>(null)
	const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

	const setOpen = React.useCallback(
		(next: boolean) => {
			if (timerRef.current) clearTimeout(timerRef.current)
			if (next) {
				timerRef.current = setTimeout(() => setOpenState(true), delayMs)
			} else {
				setOpenState(false)
			}
		},
		[delayMs],
	)

	React.useEffect(
		() => () => {
			if (timerRef.current) clearTimeout(timerRef.current)
		},
		[],
	)

	return (
		<TooltipContext.Provider value={{ open, setOpen, triggerRef, placement }}>
			{children}
		</TooltipContext.Provider>
	)
}
TooltipRoot.displayName = "Tooltip"

// ---------- Trigger ----------

export interface TooltipTriggerProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
	children: React.ReactElement<
		React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
	>
}

const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
	function TooltipTrigger({ children, ...triggerProps }, forwardedRef) {
		const { setOpen, triggerRef } = useTooltipContext()
		const childRef = (
			children as React.ReactElement & { ref?: React.Ref<HTMLElement> }
		).ref
		const childProps = children.props as React.HTMLAttributes<HTMLElement> &
			React.RefAttributes<HTMLElement>

		return React.cloneElement(children, {
			...childProps,
			...triggerProps,
			ref: composeRefs(triggerRef, forwardedRef, childRef),
			onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
				childProps.onMouseEnter?.(e)
				triggerProps.onMouseEnter?.(e)
				setOpen(true)
			},
			onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
				childProps.onMouseLeave?.(e)
				triggerProps.onMouseLeave?.(e)
				setOpen(false)
			},
			onFocus: (e: React.FocusEvent<HTMLElement>) => {
				childProps.onFocus?.(e)
				triggerProps.onFocus?.(e)
				setOpen(true)
			},
			onBlur: (e: React.FocusEvent<HTMLElement>) => {
				childProps.onBlur?.(e)
				triggerProps.onBlur?.(e)
				setOpen(false)
			},
		})
	},
)
TooltipTrigger.displayName = "Tooltip.Trigger"

// ---------- Positioning ----------

function getPosition(
	triggerRect: DOMRect,
	contentRect: DOMRect,
	placement: TooltipPlacement,
): React.CSSProperties {
	const { top, bottom, left, right, width, height } = triggerRect
	const cw = contentRect.width
	const ch = contentRect.height

	const positions: Record<TooltipPlacement, React.CSSProperties> = {
		top: { top: top - ch - GAP, left: left + width / 2 - cw / 2 },
		"top-start": { top: top - ch - GAP, left },
		"top-end": { top: top - ch - GAP, left: right - cw },
		bottom: { top: bottom + GAP, left: left + width / 2 - cw / 2 },
		"bottom-start": { top: bottom + GAP, left },
		"bottom-end": { top: bottom + GAP, left: right - cw },
		left: { top: top + height / 2 - ch / 2, left: left - cw - GAP },
		right: { top: top + height / 2 - ch / 2, left: right + GAP },
	}

	return positions[placement]
}

// ---------- Content ----------

const tooltipContentClass = css({
	position: "fixed",
	zIndex: "tooltip",
	px: "2",
	py: "1",
	borderRadius: "sm",
	bg: "stone.900",
	color: "white",
	fontSize: "sm",
	fontWeight: "medium",
	lineHeight: "snug",
	whiteSpace: "nowrap",
	pointerEvents: "none",
	"&[data-state=open]": {
		animation: "tooltipFadeIn 0.12s {easings.out} both",
	},
})

export type TooltipContentProps = React.HTMLAttributes<HTMLDivElement>

function TooltipContent({ className, children, ...rest }: TooltipContentProps) {
	const { open, triggerRef, placement } = useTooltipContext()
	const contentRef = React.useRef<HTMLDivElement>(null)
	const [pos, setPos] = React.useState<React.CSSProperties | null>(null)

	React.useLayoutEffect(() => {
		if (!open || !triggerRef.current || !contentRef.current) return
		const triggerRect = triggerRef.current.getBoundingClientRect()
		const contentRect = contentRef.current.getBoundingClientRect()
		setPos(getPosition(triggerRect, contentRect, placement))
	}, [open, placement, triggerRef])

	if (!open) return null

	return ReactDOM.createPortal(
		<div
			ref={contentRef}
			data-state="open"
			className={cx(tooltipContentClass, className)}
			style={pos ? { ...pos } : { visibility: "hidden" }}
			{...rest}
		>
			{children}
		</div>,
		document.body,
	)
}
TooltipContent.displayName = "Tooltip.Content"

// ---------- Dot-notation export ----------

export const Tooltip = Object.assign(TooltipRoot, {
	Trigger: TooltipTrigger,
	Content: TooltipContent,
})
