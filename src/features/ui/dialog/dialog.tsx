// ui/dialog.tsx
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
import { createPortal } from "react-dom"
import { css, cx } from "../../../styles/styled-system/css"
import { IconButton } from "../icon-button"
import { Typography } from "../typography"

type DialogContextType = {
	open: boolean
	setOpen: (v: boolean) => void
	toggleOpen: () => void
	close: () => void
}
const DialogContext = createContext<DialogContextType | null>(null)

export function useDialog() {
	const ctx = useContext(DialogContext)
	if (!ctx) throw new Error("useDialog must be used within <Dialog>")
	return ctx
}

export type DialogProps = {
	children: ReactNode
	open?: boolean
	onOpenChange?: (v: boolean) => void
}

export function Dialog({
	children,
	open: controlledOpen,
	onOpenChange,
}: DialogProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
	const isControlled = controlledOpen !== undefined
	const open = isControlled ? controlledOpen : uncontrolledOpen
	const _setOpen =
		isControlled && onOpenChange ? onOpenChange : setUncontrolledOpen

	const toggleOpen = () => _setOpen(!open)
	const close = () => _setOpen(false)

	// Escape to close
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close()
		}
		document.addEventListener("keydown", onKey)
		return () => document.removeEventListener("keydown", onKey)
	}, [])

	return (
		<DialogContext.Provider
			value={{ open, setOpen: _setOpen, toggleOpen, close }}
		>
			{children}
		</DialogContext.Provider>
	)
}

Dialog.Trigger = function DialogTrigger({
	children,
	asChild = false,
	className,
}: {
	children: ReactNode
	asChild?: boolean
	className?: string
}) {
	const { toggleOpen } = useDialog()
	if (!isValidElement(children))
		throw new Error("Trigger expects a single valid React element")
	const child = children as ReactElement<any>
	return asChild ? (
		cloneElement(child, {
			onClick: (e: any) => {
				toggleOpen()
				child.props.onClick?.(e)
			},
			className: cx(child.props.className, className),
		})
	) : (
		<button type="button" onClick={toggleOpen} className={className}>
			{children}
		</button>
	)
}

Dialog.ContentBase = function DialogContentBase({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	const { open } = useDialog()
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (open) ref.current?.focus()
	}, [open])

	const content = (
		<>
			{/* Overlay */}
			<div
				className={css({
					position: "fixed",
					inset: 0,
					bg: "rgba(0,0,0,0.5)",
					opacity: open ? 1 : 0,
					pointerEvents: open ? "auto" : "none",
					transition: "opacity 200ms ease",
					zIndex: 40,
				})}
			/>
			{/* Panel container */}
			<div
				ref={ref}
				tabIndex={-1}
				className={cx(
					css({
						zIndex: 50,
						position: "fixed",
						width: "100%",
						height: "100%",
					}),
					className,
				)}
			>
				{children}
			</div>
		</>
	)

	return createPortal(content, document.body)
}

Dialog.Content = function DialogContent({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	const { open } = useDialog()
	return (
		<Dialog.ContentBase>
			<div
				className={cx(
					css({
						position: "fixed",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						opacity: open ? 1 : 0,
						transition: "opacity 200ms ease, transform 200ms ease",
						bg: "neutral.0",
						borderRadius: "md",
						boxShadow: "lg",
						width: "100%",
						maxWidth: "md",
					}),
					className,
				)}
			>
				{children}
			</div>
		</Dialog.ContentBase>
	)
}

Dialog.Header = function DialogHeader({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	const { close } = useDialog()
	return (
		<div className={cx(css({ p: "md", position: "relative" }), className)}>
			<IconButton
				name="X"
				size={16}
				className={css({
					position: "absolute",
					top: "0.5rem",
					right: "0.5rem",
				})}
				onClick={() => close()}
			/>
			{children}
		</div>
	)
}

Dialog.Description = function DialogDescription({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<Typography.Text className={className} color="muted" textStyle={"xs"}>
			{children}
		</Typography.Text>
	)
}

Dialog.Title = function DialogTitle({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<Typography.Heading
			level={2}
			className={cx(css({ textStyle: "md", fontWeight: "bold" }), className)}
		>
			{children}
		</Typography.Heading>
	)
}

Dialog.Footer = function DialogFooter({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<div
			className={cx(
				css({
					p: "md",
					display: "flex",
					justifyContent: "flex-end",
					gap: "sm",
				}),
				className,
			)}
		>
			{children}
		</div>
	)
}
