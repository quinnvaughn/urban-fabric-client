import * as React from "react"
import * as ReactDOM from "react-dom"
import { cx } from "@/styles/styled-system/css"
import { tooltip as tooltipRecipe } from "@/styles/styled-system/recipes"

// ---------- Types ----------

export type TooltipSide = "top" | "bottom" | "left" | "right"

const GAP = 6 // px between trigger and tooltip
const ARROW = 5 // px arrow size

// ---------- Context ----------

interface TooltipContextValue {
	open: boolean
	setOpen: (open: boolean) => void
	triggerRef: React.RefObject<HTMLElement | null>
	side: TooltipSide
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
	side?: TooltipSide
	/** Delay before showing, in ms. Default: 400 */
	delayMs?: number
}

function TooltipRoot({
	children,
	side = "top",
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
		<TooltipContext.Provider value={{ open, setOpen, triggerRef, side }}>
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

interface Position {
	content: React.CSSProperties
	arrow: React.CSSProperties
}

function getPosition(
	triggerRect: DOMRect,
	contentRect: DOMRect,
	side: TooltipSide,
): Position {
	const { top, bottom, left, right, width, height } = triggerRect
	const cw = contentRect.width
	const ch = contentRect.height

	const positions: Record<
		TooltipSide,
		{ content: React.CSSProperties; arrow: React.CSSProperties }
	> = {
		top: {
			content: {
				top: top - ch - GAP - ARROW,
				left: left + width / 2 - cw / 2,
			},
			arrow: {
				top: top - GAP - ARROW * 2,
				left: left + width / 2 - ARROW,
				borderLeft: `${ARROW}px solid transparent`,
				borderRight: `${ARROW}px solid transparent`,
				borderTop: `${ARROW}px solid var(--colors-stone-900, #2c2a27)`,
			},
		},
		bottom: {
			content: {
				top: bottom + GAP + ARROW,
				left: left + width / 2 - cw / 2,
			},
			arrow: {
				top: bottom + GAP,
				left: left + width / 2 - ARROW,
				borderLeft: `${ARROW}px solid transparent`,
				borderRight: `${ARROW}px solid transparent`,
				borderBottom: `${ARROW}px solid var(--colors-stone-900, #2c2a27)`,
			},
		},
		left: {
			content: {
				top: top + height / 2 - ch / 2,
				left: left - cw - GAP - ARROW,
			},
			arrow: {
				top: top + height / 2 - ARROW,
				left: left - GAP - ARROW * 2,
				borderTop: `${ARROW}px solid transparent`,
				borderBottom: `${ARROW}px solid transparent`,
				borderLeft: `${ARROW}px solid var(--colors-stone-900, #2c2a27)`,
			},
		},
		right: {
			content: {
				top: top + height / 2 - ch / 2,
				left: right + GAP + ARROW,
			},
			arrow: {
				top: top + height / 2 - ARROW,
				left: right + GAP,
				borderTop: `${ARROW}px solid transparent`,
				borderBottom: `${ARROW}px solid transparent`,
				borderRight: `${ARROW}px solid var(--colors-stone-900, #2c2a27)`,
			},
		},
	}

	return positions[side]
}

// ---------- Content ----------

const styles = tooltipRecipe()

export interface TooltipContentProps
	extends React.HTMLAttributes<HTMLDivElement> {
	/** Override the side set on the root */
	side?: TooltipSide
	arrow?: boolean
}

function TooltipContent({
	className,
	children,
	side: sideProp,
	arrow = true,
	...rest
}: TooltipContentProps) {
	const { open, triggerRef, side: sideCtx } = useTooltipContext()
	const side = sideProp ?? sideCtx
	const contentRef = React.useRef<HTMLDivElement>(null)
	const [pos, setPos] = React.useState<Position | null>(null)

	React.useLayoutEffect(() => {
		if (!open || !triggerRef.current || !contentRef.current) return
		const triggerRect = triggerRef.current.getBoundingClientRect()
		const contentRect = contentRef.current.getBoundingClientRect()
		setPos(getPosition(triggerRect, contentRect, side))
	}, [open, side, triggerRef])

	if (!open) return null

	return ReactDOM.createPortal(
		<>
			<div
				ref={contentRef}
				data-state="open"
				className={cx(styles.content, className)}
				style={pos ? { ...pos.content } : { visibility: "hidden" }}
				{...rest}
			>
				{children}
			</div>
			{arrow && pos && <div className={styles.arrow} style={pos.arrow} />}
		</>,
		document.body,
	)
}
TooltipContent.displayName = "Tooltip.Content"

// ---------- Dot-notation export ----------

export const Tooltip = Object.assign(TooltipRoot, {
	Trigger: TooltipTrigger,
	Content: TooltipContent,
})
