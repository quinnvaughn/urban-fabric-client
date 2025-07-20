import {
	createContext,
	type ReactNode,
	useContext,
	useLayoutEffect,
	useRef,
	useState,
} from "react"
import { css, cx } from "../../../styles/styled-system/css"

type CollapsibleContextType = {
	open: boolean
	toggle: () => void
	setOpen: (val: boolean) => void
	contentRef: React.RefObject<HTMLDivElement | null>
}

const CollapsibleContext = createContext<CollapsibleContextType | null>(null)

function useCollapsibleContext() {
	const ctx = useContext(CollapsibleContext)
	if (!ctx) throw new Error("Collapsible.* must be used inside <Collapsible>")
	return ctx
}

export function Collapsible({
	defaultOpen = false,
	children,
}: {
	defaultOpen?: boolean
	children: ReactNode
}) {
	const [open, setOpen] = useState(defaultOpen)
	const toggle = () => setOpen((prev) => !prev)
	const contentRef = useRef<HTMLDivElement>(null)

	return (
		<CollapsibleContext.Provider value={{ open, toggle, setOpen, contentRef }}>
			{children}
		</CollapsibleContext.Provider>
	)
}

Collapsible.Trigger = function Trigger({
	children,
	className,
}: {
	children: ReactNode | ((props: { open: boolean }) => ReactNode)
	className?: string
}) {
	const { toggle, open } = useCollapsibleContext()

	return (
		<button
			type="button"
			onClick={toggle}
			className={cx(css({ cursor: "pointer" }), className)}
		>
			{typeof children === "function" ? children({ open }) : children}
		</button>
	)
}

Collapsible.Content = function Content({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	const { open, contentRef } = useCollapsibleContext()
	const [height, setHeight] = useState<number | "auto">(0)

	useLayoutEffect(() => {
		const el = contentRef.current
		if (!el) return

		if (open) {
			const fullHeight = el.scrollHeight
			setHeight(fullHeight)
			const timeout = setTimeout(() => {
				setHeight("auto")
			}, 200)
			return () => clearTimeout(timeout)
		} else {
			if (el.scrollHeight !== 0) {
				setHeight(el.scrollHeight)
				requestAnimationFrame(() => {
					setHeight(0)
				})
			}
		}
	}, [open, contentRef.current])

	return (
		<div
			ref={contentRef}
			className={className}
			style={{
				overflow: "hidden",
				transition: "height 0.2s ease",
				height: height === "auto" ? "auto" : `${height}px`,
			}}
		>
			{children}
		</div>
	)
}
