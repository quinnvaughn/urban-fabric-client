import { X } from "lucide-react"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { cx } from "@/styles/styled-system/css"
import { modal as modalRecipe } from "@/styles/styled-system/recipes"
import type { ColorToken } from "@/styles/styled-system/tokens"
import { Typography, type TextProps } from "../typography"

// ---------- Types ----------

type ModalSize = "sm" | "md" | "lg"

// ---------- Context ----------

interface ModalContextValue {
	onClose: () => void
	titleId: string
}

const ModalContext = React.createContext<ModalContextValue | null>(null)

function useModalContext() {
	const ctx = React.useContext(ModalContext)
	if (!ctx) throw new Error("Modal sub-components must be used within <Modal>")
	return ctx
}

// ---------- Root ----------

export interface ModalProps {
	open: boolean
	onClose: () => void
	/** Accessible label id — auto-generated if omitted */
	titleId?: string
	size?: ModalSize
	children: React.ReactNode
}

function ModalRoot({
	open,
	onClose,
	titleId: titleIdProp,
	size = "md",
	children,
}: ModalProps) {
	const autoId = React.useId()
	const titleId = titleIdProp ?? `modal-title-${autoId}`
	const styles = modalRecipe({ size })

	// Close on Escape
	React.useEffect(() => {
		if (!open) return
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onClose()
		}
		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [open, onClose])

	// Prevent body scroll while open
	React.useEffect(() => {
		if (!open) return
		const prev = document.body.style.overflow
		document.body.style.overflow = "hidden"
		return () => {
			document.body.style.overflow = prev
		}
	}, [open])

	if (!open) return null

	return ReactDOM.createPortal(
		<ModalContext.Provider value={{ onClose, titleId }}>
			<div
				className={styles.backdrop}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				onPointerDown={(e) => {
					// Close on backdrop click, not on content click
					if (e.target === e.currentTarget) onClose()
				}}
			>
				<div className={styles.content}>{children}</div>
			</div>
		</ModalContext.Provider>,
		document.body,
	)
}
ModalRoot.displayName = "Modal"

// ---------- Header ----------

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: ModalSize
}

function ModalHeader({
	className,
	size = "md",
	children,
	...rest
}: ModalHeaderProps) {
	const styles = modalRecipe({ size })
	return (
		<div className={cx(styles.header, className)} {...rest}>
			{children}
		</div>
	)
}
ModalHeader.displayName = "Modal.Header"

// ---------- Title ----------

export type ModalTitleProps = TextProps

function ModalTitle({
	size = "md",
	weight = "semibold",
	color = "fg.default",
	...rest
}: ModalTitleProps) {
	const { titleId } = useModalContext()
	return (
		<Typography.Text
			id={titleId}
			size={size}
			weight={weight}
			color={color}
			{...rest}
		/>
	)
}
ModalTitle.displayName = "Modal.Title"

// ---------- CloseButton ----------

export interface ModalCloseBtnProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	size?: ModalSize
}

function ModalCloseBtn({
	className,
	size = "md",
	...rest
}: ModalCloseBtnProps) {
	const styles = modalRecipe({ size })
	const { onClose } = useModalContext()
	return (
		<button
			type="button"
			aria-label="Close"
			className={cx(styles.closeBtn, className)}
			onClick={onClose}
			{...rest}
		>
			<X size={16} />
		</button>
	)
}
ModalCloseBtn.displayName = "Modal.CloseBtn"

// ---------- Body ----------

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: ModalSize
}

function ModalBody({ className, size = "md", ...rest }: ModalBodyProps) {
	const styles = modalRecipe({ size })
	return <div className={cx(styles.body, className)} {...rest} />
}
ModalBody.displayName = "Modal.Body"

// ---------- Eyebrow ----------

export interface ModalEyebrowProps
	extends React.HTMLAttributes<HTMLSpanElement> {
	color?: ColorToken
}

function ModalEyebrow({ color, ...rest }: ModalEyebrowProps) {
	return (
		<Typography.Text
			size="xxs"
			weight="semibold"
			transform="uppercase"
			letterSpacing="wider"
			color={color}
			{...rest}
		/>
	)
}
ModalEyebrow.displayName = "Modal.Eyebrow"

// ---------- Dot-notation export ----------

export const Modal = Object.assign(ModalRoot, {
	Header: ModalHeader,
	Title: ModalTitle,
	CloseBtn: ModalCloseBtn,
	Body: ModalBody,
	Eyebrow: ModalEyebrow,
})
