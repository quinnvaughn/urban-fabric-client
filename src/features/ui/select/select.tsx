import React, {
	cloneElement,
	createContext,
	type Dispatch,
	isValidElement,
	type ReactElement,
	type ReactNode,
	type RefObject,
	type SetStateAction,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import { createPortal } from "react-dom"
import { match } from "ts-pattern"
import { css, cx } from "../../../styles/styled-system/css"
import { Icon } from "../icon"

export type SelectOption = { value: string; label: ReactNode }

type SelectContextType = {
	open: boolean
	value?: string
	setOpen: Dispatch<SetStateAction<boolean>>
	setValue: Dispatch<SetStateAction<string>>
	triggerRef: RefObject<HTMLButtonElement | null>
	contentRef: RefObject<HTMLDivElement | null>
	highlightedIndex: number
	setHighlightedIndex: Dispatch<SetStateAction<number>>
	options: SelectOption[]
	placeholder: string
	portalPos: { top: number; left: number; width: number }
}

const SelectContext = createContext<SelectContextType | null>(null)
function useSelectContext() {
	const ctx = useContext(SelectContext)
	if (!ctx) throw new Error("Select.* must be inside <Select>")
	return ctx
}

type SelectProps = {
	value?: string
	onChange: (value: string) => void
	placeholder?: string
	children: ReactNode
	className?: string
}

export function Select({
	value,
	onChange,
	placeholder = "Select...",
	children,
	className,
}: SelectProps) {
	const [open, setOpen] = useState(false)
	const [highlightedIndex, setHighlightedIndex] = useState(-1)
	const [portalPos, setPortalPos] = useState({ top: 0, left: 0, width: 0 })
	const triggerRef = useRef<HTMLButtonElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)

	const options: SelectOption[] = useMemo(() => {
		const contentEl = React.Children.toArray(children).find(
			(el) => isValidElement(el) && el.type === Select.Content,
		) as ReactElement<any> | undefined

		if (!contentEl) return []

		return React.Children.toArray(contentEl.props.children)
			.filter(isValidElement)
			.map((itemEl: ReactElement<SelectItemProps>) => ({
				value: itemEl.props.value,
				label: itemEl.props.children,
			}))
	}, [children])

	// close on outside click
	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (
				triggerRef.current?.contains(e.target as Node) ||
				contentRef.current?.contains(e.target as Node)
			) {
				return
			}
			setOpen(false)
			setHighlightedIndex(-1)
		}
		document.addEventListener("mousedown", handleClick)
		return () => document.removeEventListener("mousedown", handleClick)
	}, [])

	// keyboard nav
	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			const items = Array.from(
				contentRef.current?.querySelectorAll('[role="option"]') || [],
			) as HTMLElement[]
			if (!open) {
				if (e.key === "ArrowDown" || e.key === "ArrowUp") {
					e.preventDefault()
					setOpen(true)
					setHighlightedIndex(
						options.findIndex((opt) => opt.value === value) || 0,
					)
				}
				return
			}
			match(e.key)
				.with("ArrowDown", () => {
					e.preventDefault()
					setHighlightedIndex((i) => Math.min(i + 1, items.length - 1))
				})
				.with("ArrowUp", () => {
					e.preventDefault()
					setHighlightedIndex((i) => Math.max(i - 1, 0))
				})
				.with("Enter", () => {
					e.preventDefault()
					if (items[highlightedIndex]) {
						const val = items[highlightedIndex].getAttribute("data-value")
						if (val) onChange(val)
					}
					setOpen(false)
				})
				.with("Escape", () => {
					e.preventDefault()
					setOpen(false)
				})
				.otherwise(() => {})
		}
		document.addEventListener("keydown", onKeyDown as any)
		return () => document.removeEventListener("keydown", onKeyDown as any)
	}, [open, highlightedIndex, options, value, onChange])

	// measure trigger when opening
	useLayoutEffect(() => {
		if (open && triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect()
			setPortalPos({
				top: rect.bottom + window.scrollY,
				left: rect.left + window.scrollX,
				width: rect.width,
			})
		}
	}, [open])

	return (
		<SelectContext.Provider
			value={{
				open,
				value,
				setOpen,
				setValue: onChange,
				triggerRef,
				contentRef,
				highlightedIndex,
				setHighlightedIndex,
				options,
				placeholder,
				portalPos,
			}}
		>
			<div
				className={cx(
					css({
						position: "relative",
						display: "inline-block",
						width: "100%",
					}),
					className,
				)}
			>
				{children}
			</div>
		</SelectContext.Provider>
	)
}

Select.Trigger = function SelectTrigger({
	children,
	className,
	asChild = false,
}: {
	children: ReactNode
	className?: string
	asChild?: boolean
}) {
	const { open, setOpen, triggerRef, value, options, placeholder } =
		useSelectContext()
	const label = options.find((opt) => opt.value === value)?.label ?? placeholder

	const triggerStyles = css({
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "space-between",
		width: "100%",
		px: "sm",
		py: "xs",
		border: "1px solid",
		borderColor: "neutral.200",
		borderRadius: "md",
		bg: "neutral.0",
		cursor: "pointer",
		fontSize: "sm",
	})

	const content = (
		<>
			<span>{label}</span>
			<Icon name="CaretDown" size={16} />
		</>
	)

	if (asChild && isValidElement(children)) {
		return cloneElement(children as ReactElement<any>, {
			ref: triggerRef,
			className: cx(triggerStyles, className),
			onClick: () => setOpen((o) => !o),
			"aria-haspopup": "listbox",
			"aria-expanded": open,
			children: content,
		})
	}

	return (
		<button
			ref={triggerRef}
			type="button"
			className={cx(triggerStyles, className)}
			onClick={() => setOpen((o) => !o)}
			aria-haspopup="listbox"
			aria-expanded={open}
		>
			{content}
		</button>
	)
}

Select.Content = function SelectContent({
	children,
	className,
}: {
	children:
		| ReactElement<{
				value: string
				children: ReactNode
				className?: string
				index?: number
				closeOnSelect?: boolean
		  }>
		| ReactElement<{
				value: string
				children: ReactNode
				className?: string
				index?: number
				closeOnSelect?: boolean
		  }>[]
	className?: string
}) {
	const { open, contentRef, portalPos } = useSelectContext()

	const contentStyles = css({
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		zIndex: 1000,
		bg: "neutral.0",
		border: "1px solid",
		borderColor: "neutral.200",
		borderRadius: "md",
		boxShadow: "md",
		maxHeight: "240px",
		overflowY: "auto",
	})

	if (!open) return null

	const style: React.CSSProperties = {
		position: "absolute",
		top: portalPos.top,
		left: portalPos.left,
		width: portalPos.width,
	}

	const el = (
		<div
			ref={contentRef}
			role="listbox"
			className={cx(contentStyles, className)}
			style={style}
		>
			{React.Children.map(children, (child, idx) =>
				isValidElement(child)
					? cloneElement(child, {
							index: idx,
							key: `option-${child.props.value}`,
						})
					: child,
			)}
		</div>
	)

	return createPortal(el, document.body)
}

type SelectItemProps = {
	value: string
	children: ReactNode
	className?: string
	index?: number
	closeOnSelect?: boolean
}
Select.Item = function SelectItem({
	value,
	children,
	className,
	index,
	closeOnSelect = true,
}: SelectItemProps) {
	const {
		setOpen,
		setValue,
		highlightedIndex,
		setHighlightedIndex,
		value: selectedValue,
	} = useSelectContext()

	const itemBase = css({
		px: "sm",
		py: "xs",
		cursor: "pointer",
		fontSize: "sm",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	})
	const highlightedBg = css({ bg: "neutral.100" })
	const isHighlighted = highlightedIndex === index
	const isSelected = selectedValue === value

	return (
		<div
			role="option"
			tabIndex={0}
			data-value={value}
			className={cx(itemBase, isHighlighted && highlightedBg, className)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault()
					setValue(value)
					if (closeOnSelect) setOpen(false)
				}
			}}
			onClick={() => {
				setValue(value)
				if (closeOnSelect) setOpen(false)
			}}
			onMouseEnter={() => {
				if (index !== undefined) setHighlightedIndex(index)
			}}
		>
			{children}
			{isSelected && (
				<Icon
					name="Check"
					size={16}
					className={css({ color: "neutral.500" })}
				/>
			)}
		</div>
	)
}
