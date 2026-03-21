import { createLink, type LinkComponentProps } from "@tanstack/react-router"
import { ChevronDown } from "lucide-react"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { css, cx } from "@/styles/styled-system/css"
import {
	type MenuVariantProps,
	menu as menuRecipe,
} from "@/styles/styled-system/recipes"

// ---------- Context ----------

interface MenuContextValue {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	triggerRef: React.RefObject<HTMLElement | null>
	gap: number
	placement: MenuPlacement
}

const MenuContext = React.createContext<MenuContextValue | null>(null)

function useMenuContext() {
	const ctx = React.useContext(MenuContext)
	if (!ctx)
		throw new Error("Menu.Trigger and Menu.Content must be used within <Menu>")
	return ctx
}

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
	return (node: T) => {
		for (const ref of refs) {
			if (!ref) continue
			if (typeof ref === "function") {
				ref(node)
			} else {
				;(ref as React.RefObject<T>).current = node
			}
		}
	}
}

// ---------- Root ----------

export type MenuPlacement =
	| "top-start"
	| "top-end"
	| "bottom-start"
	| "bottom-end"

export interface MenuRootProps {
	children: React.ReactNode
	/** Controlled open state */
	open?: boolean
	onOpenChange?: (open: boolean) => void
	/** Gap between the trigger and the menu edge, in px. Default: 6 */
	gap?: number
	/** Where the menu opens relative to the trigger. Default: "top-end" */
	placement?: MenuPlacement
}

function MenuRoot({
	children,
	open: openProp,
	onOpenChange,
	gap = 6,
	placement = "top-end",
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
		<MenuContext.Provider value={{ open, setOpen, triggerRef, gap, placement }}>
			{children}
		</MenuContext.Provider>
	)
}
MenuRoot.displayName = "Menu"

// ---------- Trigger ----------

export interface MenuTriggerProps {
	children: React.ReactElement<
		React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
	>
}

const MenuTrigger = React.forwardRef<HTMLElement, MenuTriggerProps>(
	function MenuTrigger({ children }, forwardedRef) {
		const { open, setOpen, triggerRef } = useMenuContext()
		const childRef = (
			children as React.ReactElement & { ref?: React.Ref<HTMLElement> }
		).ref
		const childProps = children.props as React.HTMLAttributes<HTMLElement> &
			React.RefAttributes<HTMLElement>

		return React.cloneElement(children, {
			...childProps,
			ref: composeRefs(triggerRef, forwardedRef, childRef),
			onClick: (e: React.MouseEvent<HTMLElement>) => {
				childProps.onClick?.(e)
				if (!e.defaultPrevented) setOpen((v) => !v)
			},
			"aria-haspopup": "true",
			"aria-expanded": open,
		})
	},
)
MenuTrigger.displayName = "Menu.Trigger"

// ---------- Positioning hook ----------

function useMenuPosition(
	triggerRef: React.RefObject<HTMLElement | null>,
	open: boolean,
	gap: number,
	placement: MenuPlacement,
) {
	const [pos, setPos] = React.useState<React.CSSProperties>({})

	React.useEffect(() => {
		if (!open) return

		function calculate() {
			if (!triggerRef.current) return
			const rect = triggerRef.current.getBoundingClientRect()
			if (placement === "bottom-start") {
				setPos({ top: rect.bottom + gap, left: rect.left })
			} else if (placement === "bottom-end") {
				setPos({
					top: rect.bottom + gap,
					left: rect.right,
					transform: "translateX(-100%)",
				})
			} else if (placement === "top-start") {
				setPos({
					bottom: window.innerHeight - rect.top + gap,
					left: rect.left,
				})
			} else {
				setPos({
					bottom: window.innerHeight - rect.top + gap,
					left: rect.right,
					transform: "translateX(-100%)",
				})
			}
		}

		calculate()
		window.addEventListener("resize", calculate)
		return () => window.removeEventListener("resize", calculate)
	}, [triggerRef, open, gap, placement])

	return pos
}

// ---------- Content ----------

const styles = menuRecipe()

export interface MenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: MenuVariantProps["size"]
}

function MenuContent({ className, children, size, ...rest }: MenuContentProps) {
	const { open, setOpen, triggerRef, gap, placement } = useMenuContext()
	const pos = useMenuPosition(triggerRef, open, gap, placement)
	const contentStyles = menuRecipe({ size })
	const contentRef = React.useRef<HTMLDivElement>(null)

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
				className={cx(contentStyles.content, className)}
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
	intent?: "neutral" | "danger"
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
	intent,
	...rest
}: MenuItemProps) {
	const { setOpen } = useMenuContext()
	const itemStyles = menuRecipe({ intent })

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
				className={cx(itemStyles.item, className)}
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
			className={cx(itemStyles.item, className)}
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

// ---------- Link (TanStack Router) ----------

export interface MenuLinkAnchorProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	icon?: React.ReactNode
	kbd?: React.ReactNode
	intent?: "neutral" | "danger"
}

const MenuLinkAnchor = React.forwardRef<HTMLAnchorElement, MenuLinkAnchorProps>(
	function MenuLinkAnchor(
		{ icon, kbd, intent, className, children, href, onClick, ...rest },
		ref,
	) {
		const { setOpen } = useMenuContext()
		const itemStyles = menuRecipe({ intent })

		return (
			<a
				ref={ref}
				role="menuitem"
				href={href}
				className={cx(itemStyles.item, className)}
				{...rest}
				onClick={(e) => {
					onClick?.(e)
					setOpen(false)
				}}
			>
				{icon && <span data-slot="icon">{icon}</span>}
				{children}
				{kbd && <span data-slot="kbd">{kbd}</span>}
			</a>
		)
	},
)
MenuLinkAnchor.displayName = "MenuLinkAnchor"

const CreatedMenuLink = createLink(MenuLinkAnchor)

export type MenuLinkProps = LinkComponentProps<typeof MenuLinkAnchor> & {
	exact?: boolean
}

function MenuLink({ exact, activeOptions, ...props }: MenuLinkProps) {
	return (
		<CreatedMenuLink
			preload="intent"
			activeOptions={{
				...activeOptions,
				exact: exact ?? activeOptions?.exact,
			}}
			{...props}
		/>
	)
}
MenuLink.displayName = "Menu.Link"

// ---------- CheckItem ----------

export interface MenuCheckItemProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}

function MenuCheckItem({
	checked,
	onCheckedChange,
	className,
	children,
	disabled,
	...rest
}: MenuCheckItemProps) {
	return (
		<button
			role="menuitemcheckbox"
			type="button"
			aria-checked={checked}
			data-checked={checked ? "" : undefined}
			disabled={disabled}
			className={cx(styles.checkItem, className)}
			{...rest}
			onClick={(e) => {
				rest.onClick?.(e)
				if (!e.defaultPrevented) onCheckedChange(!checked)
			}}
		>
			<span className={styles.checkBox} aria-hidden="true">
				{checked && (
					<svg
						width="9"
						height="9"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="3.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>Check</title>
						<polyline points="20 6 9 17 4 12" />
					</svg>
				)}
			</span>
			{children}
		</button>
	)
}
MenuCheckItem.displayName = "Menu.CheckItem"

// ---------- Separator ----------

export interface MenuSeparatorProps
	extends React.HTMLAttributes<HTMLHRElement> {}

function MenuSeparator({ className, ...rest }: MenuSeparatorProps) {
	return <hr className={cx(styles.separator, className)} {...rest} />
}
MenuSeparator.displayName = "Menu.Separator"

// ---------- FilterTrigger ----------

export interface MenuFilterTriggerProps {
	children: React.ReactNode
	className?: string
	active?: boolean
}

function MenuFilterTrigger({
	children,
	className,
	active,
}: MenuFilterTriggerProps) {
	const { open } = useMenuContext()

	return (
		<MenuTrigger>
			<button
				type="button"
				data-active={active || undefined}
				data-open={open || undefined}
				className={cx(styles.filterTrigger, className)}
			>
				{children}
				<ChevronDown
					size={12}
					className={css({
						transition: "transform 150ms",
						transform: open ? "rotate(180deg)" : "rotate(0deg)",
					})}
				/>
			</button>
		</MenuTrigger>
	)
}
MenuFilterTrigger.displayName = "Menu.FilterTrigger"

// ---------- Dot-notation export ----------

export const Menu = Object.assign(MenuRoot, {
	Trigger: MenuTrigger,
	FilterTrigger: MenuFilterTrigger,
	Content: MenuContent,
	Item: MenuItem,
	Link: MenuLink,
	CheckItem: MenuCheckItem,
	Separator: MenuSeparator,
})
