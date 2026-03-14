import * as React from "react"
import * as ReactDOM from "react-dom"
import { css, cx } from "@/styles/styled-system/css"
import { menu as menuRecipe } from "@/styles/styled-system/recipes"

// ---------- Context ----------

interface MenuContextValue {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	triggerRef: React.RefObject<HTMLElement | null>
	gap: number
}

const MenuContext = React.createContext<MenuContextValue | null>(null)

function useMenuContext() {
	const ctx = React.useContext(MenuContext)
	if (!ctx)
		throw new Error("Menu.Trigger and Menu.Content must be used within <Menu>")
	return ctx
}

// ---------- Root ----------

export interface MenuRootProps {
	children: React.ReactNode
	/** Controlled open state */
	open?: boolean
	onOpenChange?: (open: boolean) => void
	/** Gap between the trigger and the menu edge, in px. Default: 6 */
	gap?: number
}

function MenuRoot({
	children,
	open: openProp,
	onOpenChange,
	gap = 6,
}: MenuRootProps) {
	const [openState, setOpenState] = React.useState(false)
	const triggerRef = React.useRef<HTMLElement | null>(null)

	const open = openProp ?? openState
	const setOpen: React.Dispatch<React.SetStateAction<boolean>> =
		React.useCallback(
			(value) => {
				const next = typeof value === "function" ? value(open) : value
				setOpenState(next)
				onOpenChange?.(next)
			},
			[open, onOpenChange],
		)

	return (
		<MenuContext.Provider value={{ open, setOpen, triggerRef, gap }}>
			{children}
		</MenuContext.Provider>
	)
}
MenuRoot.displayName = "Menu"

// ---------- Trigger ----------

export interface MenuTriggerProps {
	children: React.ReactElement
}

function MenuTrigger({ children }: MenuTriggerProps) {
	const { open, setOpen, triggerRef } = useMenuContext()
	const child = children as React.ReactElement<
		React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
	>

	return React.cloneElement(child, {
		ref: triggerRef,
		onClick: (e: React.MouseEvent<HTMLElement>) => {
			child.props.onClick?.(e)
			setOpen((v) => !v)
		},
		"aria-haspopup": "true",
		"aria-expanded": open,
	})
}
MenuTrigger.displayName = "Menu.Trigger"

// ---------- Positioning hook ----------

function useMenuPosition(
	triggerRef: React.RefObject<HTMLElement | null>,
	open: boolean,
	gap: number,
) {
	const [pos, setPos] = React.useState<React.CSSProperties>({})

	React.useEffect(() => {
		if (!open) return

		function calculate() {
			if (!triggerRef.current) return
			const rect = triggerRef.current.getBoundingClientRect()
			setPos({
				bottom: window.innerHeight - rect.top + gap,
				left: rect.right,
				transform: "translateX(-100%)",
			})
		}

		calculate()
		window.addEventListener("resize", calculate)
		return () => window.removeEventListener("resize", calculate)
	}, [triggerRef, open, gap])

	return pos
}

// ---------- Content ----------

const styles = menuRecipe()

export interface MenuContentProps
	extends React.HTMLAttributes<HTMLDivElement> {}

function MenuContent({ className, children, ...rest }: MenuContentProps) {
	const { open, setOpen, triggerRef, gap } = useMenuContext()
	const pos = useMenuPosition(triggerRef, open, gap)
	const contentRef = React.useRef<HTMLDivElement>(null)

	// Close on outside click — exclude the trigger so its own toggle handler fires cleanly
	React.useEffect(() => {
		if (!open) return
		function handlePointerDown(e: PointerEvent) {
			const target = e.target as Node
			if (
				contentRef.current &&
				!contentRef.current.contains(target) &&
				!triggerRef.current?.contains(target)
			) {
				setOpen(false)
			}
		}
		document.addEventListener("pointerdown", handlePointerDown)
		return () => document.removeEventListener("pointerdown", handlePointerDown)
	}, [open, setOpen, triggerRef])

	// Close on Escape
	React.useEffect(() => {
		if (!open) return
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") setOpen(false)
		}
		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [open, setOpen])

	if (!open) return null

	return ReactDOM.createPortal(
		<div
			ref={contentRef}
			className={css({ position: "fixed", zIndex: "floating" })}
			style={pos}
		>
			<div
				role="menu"
				data-state="open"
				className={cx(styles.content, className)}
				{...rest}
			>
				{children}
			</div>
		</div>,
		document.body,
	)
}
MenuContent.displayName = "Menu.Content"

// ---------- Item ----------

export interface MenuItemProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: React.ReactNode
	kbd?: React.ReactNode
	/** Render as an <a> instead of <button> */
	href?: string
	target?: string
	rel?: string
}

function MenuItem({
	icon,
	kbd,
	className,
	children,
	href,
	target,
	rel,
	...rest
}: MenuItemProps) {
	const { setOpen } = useMenuContext()

	const inner = (
		<>
			{icon && <span data-slot="icon">{icon}</span>}
			{children}
			{kbd && <span data-slot="kbd">{kbd}</span>}
		</>
	)

	if (href) {
		return (
			<a
				role="menuitem"
				href={href}
				target={target}
				rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
				className={cx(styles.item, className)}
				onClick={() => setOpen(false)}
			>
				{inner}
			</a>
		)
	}

	return (
		<button
			role="menuitem"
			type="button"
			className={cx(styles.item, className)}
			{...rest}
			onClick={(e) => {
				rest.onClick?.(e)
				setOpen(false)
			}}
		>
			{inner}
		</button>
	)
}
MenuItem.displayName = "Menu.Item"

// ---------- Separator ----------

export interface MenuSeparatorProps
	extends React.HTMLAttributes<HTMLHRElement> {}

function MenuSeparator({ className, ...rest }: MenuSeparatorProps) {
	return <hr className={cx(styles.separator, className)} {...rest} />
}
MenuSeparator.displayName = "Menu.Separator"

// ---------- Dot-notation export ----------

export const Menu = Object.assign(MenuRoot, {
	Trigger: MenuTrigger,
	Content: MenuContent,
	Item: MenuItem,
	Separator: MenuSeparator,
})
