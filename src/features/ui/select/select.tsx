import { ChevronDown } from "lucide-react"
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import * as ReactDOM from "react-dom"
import { css, cx } from "@/styles/styled-system/css"
import { select as selectRecipe } from "@/styles/styled-system/recipes"
import { FieldDescription, FieldLabel } from "../field"

// ---------- Context ----------

interface SelectContextValue {
	selected: string | null
	onSelect: (value: string) => void
	isOpen: boolean
	setOpen: (open: boolean) => void
	highlightedIndex: number
	setHighlightedIndex: (i: number) => void
	disabled?: boolean
	invalid?: boolean
	required?: boolean
	slots: ReturnType<typeof selectRecipe>
	fieldId: string
	labelId: string
	triggerId: string
	listboxId: string
	describedByIds: Set<string>
	registerDescribedBy: (id: string) => () => void
	registerOption: (value: string, label: string) => () => void
	options: Array<{ value: string; label: string }>
	triggerRef: React.MutableRefObject<HTMLButtonElement | null>
	portalRef: React.MutableRefObject<HTMLDivElement | null>
	listboxRef: React.MutableRefObject<HTMLUListElement | null>
}

const SelectContext = createContext<SelectContextValue | null>(null)

function useSelectContext() {
	const ctx = useContext(SelectContext)
	if (!ctx) throw new Error("Select subcomponents must be used within <Select>")
	return ctx
}

// ---------- Root ----------

export interface SelectRootProps {
	value?: string
	defaultValue?: string
	onChange?: (value: string) => void
	size?: "sm" | "md" | "lg"
	invalid?: boolean
	disabled?: boolean
	required?: boolean
	id?: string
	className?: string
	children: React.ReactNode
}

function SelectRoot({
	value: valueProp,
	defaultValue,
	onChange,
	size = "md",
	invalid,
	disabled,
	required,
	id: idProp,
	className,
	children,
}: SelectRootProps) {
	const autoId = useId()
	const fieldId = idProp ?? autoId
	const labelId = `${fieldId}-label`
	const triggerId = `${fieldId}-trigger`
	const listboxId = `${fieldId}-listbox`

	const [internalValue, setInternalValue] = useState<string | null>(
		defaultValue ?? null,
	)
	const [isOpen, setOpenState] = useState(false)
	const [highlightedIndex, setHighlightedIndex] = useState(-1)

	const isControlled = valueProp !== undefined
	const selected = isControlled ? (valueProp ?? null) : internalValue

	const triggerRef = useRef<HTMLButtonElement>(null)
	const portalRef = useRef<HTMLDivElement>(null)
	const listboxRef = useRef<HTMLUListElement>(null)
	const [options, setOptions] = useState<
		Array<{ value: string; label: string }>
	>([])
	const describedByIds = useRef<Set<string>>(new Set())

	const registerDescribedBy = useCallback((id: string) => {
		describedByIds.current.add(id)
		return () => {
			describedByIds.current.delete(id)
		}
	}, [])

	const registerOption = useCallback((value: string, label: string) => {
		setOptions((prev) => {
			if (prev.some((o) => o.value === value)) return prev
			return [...prev, { value, label }]
		})
		return () => {
			setOptions((prev) => prev.filter((o) => o.value !== value))
		}
	}, [])

	const slots = selectRecipe({ size })

	function setOpen(open: boolean) {
		setOpenState(open)
		if (open) {
			const idx = options.findIndex((o) => o.value === selected)
			setHighlightedIndex(idx === -1 ? 0 : idx)
		} else {
			setHighlightedIndex(-1)
			triggerRef.current?.focus()
		}
	}

	function onSelect(value: string) {
		if (!isControlled) setInternalValue(value)
		onChange?.(value)
		setOpen(false)
	}

	function positionPortal() {
		if (!triggerRef.current || !portalRef.current) return
		const rect = triggerRef.current.getBoundingClientRect()
		const el = portalRef.current
		el.style.setProperty("--select-trigger-width", `${rect.width}px`)
		el.style.top = `${rect.bottom + 4}px`
		el.style.left = `${rect.left}px`
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!isOpen) return
		positionPortal()
		listboxRef.current?.focus()

		function onScroll() {
			positionPortal()
		}
		function onResize() {
			positionPortal()
		}
		function onPointerDown(e: PointerEvent) {
			if (
				!triggerRef.current?.contains(e.target as Node) &&
				!portalRef.current?.contains(e.target as Node)
			) {
				setOpen(false)
			}
		}

		window.addEventListener("scroll", onScroll, true)
		window.addEventListener("resize", onResize)
		document.addEventListener("pointerdown", onPointerDown)
		return () => {
			window.removeEventListener("scroll", onScroll, true)
			window.removeEventListener("resize", onResize)
			document.removeEventListener("pointerdown", onPointerDown)
		}
	}, [isOpen])

	useEffect(() => {
		if (!listboxRef.current || highlightedIndex === -1) return
		const items =
			listboxRef.current.querySelectorAll<HTMLElement>("[role=option]")
		items[highlightedIndex]?.scrollIntoView({ block: "nearest" })
	}, [highlightedIndex])

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore
	const ctx: SelectContextValue = useMemo(
		() => ({
			selected,
			onSelect,
			isOpen,
			setOpen,
			highlightedIndex,
			setHighlightedIndex,
			disabled,
			invalid,
			required,
			slots,
			fieldId,
			labelId,
			triggerId,
			listboxId,
			describedByIds: describedByIds.current,
			registerDescribedBy,
			registerOption,
			options,
			triggerRef,
			portalRef,
			listboxRef,
		}),
		[
			selected,
			isOpen,
			highlightedIndex,
			disabled,
			invalid,
			required,
			slots,
			labelId,
			triggerId,
			listboxId,
			options,
		],
	)

	return (
		<SelectContext.Provider value={ctx}>
			<div className={cx(slots.root, className)}>{children}</div>
		</SelectContext.Provider>
	)
}

// ---------- Label ----------

export interface SelectLabelProps
	extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {}

function SelectLabel({ className, children, ...rest }: SelectLabelProps) {
	const { labelId, required } = useSelectContext()

	return (
		<FieldLabel id={labelId} className={className} {...rest}>
			{children}
			{required && (
				<span className={css({ marginLeft: "0.5", color: "danger.default" })}>
					*
				</span>
			)}
		</FieldLabel>
	)
}
SelectLabel.displayName = "Select.Label"

// ---------- Description ----------

export interface SelectDescriptionProps
	extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color"> {}

function SelectDescription({ id, ...rest }: SelectDescriptionProps) {
	const { fieldId, registerDescribedBy } = useSelectContext()
	const descId = id ?? `${fieldId}-desc`

	useEffect(() => registerDescribedBy(descId), [registerDescribedBy, descId])

	return <FieldDescription id={descId} {...rest} />
}
SelectDescription.displayName = "Select.Description"

// ---------- Error ----------

export interface SelectErrorProps
	extends React.HTMLAttributes<HTMLParagraphElement> {}

function SelectError({ className, id, ...rest }: SelectErrorProps) {
	const { slots, fieldId, registerDescribedBy } = useSelectContext()
	const errorId = id ?? `${fieldId}-error`

	useEffect(() => registerDescribedBy(errorId), [registerDescribedBy, errorId])

	return <p id={errorId} className={cx(slots.error, className)} {...rest} />
}
SelectError.displayName = "Select.Error"

// ---------- Trigger ----------

export interface SelectTriggerProps {
	placeholder?: string
	startAdornment?: React.ReactNode
	className?: string
}

function SelectTrigger({
	placeholder = "Select…",
	startAdornment,
	className,
}: SelectTriggerProps) {
	const {
		selected,
		isOpen,
		setOpen,
		disabled,
		invalid,
		slots,
		labelId,
		triggerId,
		listboxId,
		describedByIds,
		options,
		triggerRef,
	} = useSelectContext()

	const describedBy = describedByIds.size
		? Array.from(describedByIds).join(" ")
		: undefined

	function onKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
			e.preventDefault()
			setOpen(true)
		}
	}

	const selectedLabel = options.find((o) => o.value === selected)?.label

	return (
		<button
			ref={triggerRef}
			id={triggerId}
			type="button"
			role="combobox"
			aria-haspopup="listbox"
			aria-expanded={isOpen}
			aria-labelledby={labelId}
			aria-controls={listboxId}
			aria-describedby={describedBy}
			aria-invalid={invalid ? "true" : undefined}
			data-open={isOpen ? "" : undefined}
			data-invalid={invalid ? "" : undefined}
			disabled={disabled}
			className={cx(slots.trigger, className)}
			onClick={() => setOpen(!isOpen)}
			onKeyDown={onKeyDown}
		>
			{startAdornment && (
				<span className={slots.startAdornment}>{startAdornment}</span>
			)}
			<span
				className={slots.value}
				data-placeholder={!selected ? "" : undefined}
			>
				{selectedLabel ?? placeholder}
			</span>
			<ChevronDown className={slots.chevron} size={12} />
		</button>
	)
}
SelectTrigger.displayName = "Select.Trigger"

// ---------- Portal (internal) ----------

function SelectPortal({
	isOpen,
	onKeyDown,
	children,
}: {
	isOpen: boolean
	onKeyDown: (e: React.KeyboardEvent) => void
	children: React.ReactNode
}) {
	const { slots, listboxId, triggerId, portalRef, listboxRef } =
		useSelectContext()

	return (
		<div
			ref={portalRef}
			className={slots.portal}
			aria-hidden={!isOpen}
			style={!isOpen ? { display: "none" } : undefined}
		>
			<ul
				ref={listboxRef}
				id={listboxId}
				role="listbox"
				aria-labelledby={triggerId}
				tabIndex={-1}
				className={slots.listbox}
				onKeyDown={onKeyDown}
			>
				{children}
			</ul>
		</div>
	)
}

// ---------- Options ----------

export interface SelectOptionsProps {
	children: React.ReactNode
}

function SelectOptions({ children }: SelectOptionsProps) {
	const {
		highlightedIndex,
		setHighlightedIndex,
		onSelect,
		setOpen,
		options,
		isOpen,
	} = useSelectContext()

	function onKeyDown(e: React.KeyboardEvent) {
		const count = options.length
		if (count === 0) return
		if (e.key === "ArrowDown") {
			e.preventDefault()
			setHighlightedIndex((highlightedIndex + 1) % count)
		} else if (e.key === "ArrowUp") {
			e.preventDefault()
			setHighlightedIndex((highlightedIndex - 1 + count) % count)
		} else if (e.key === "Enter" || e.key === " ") {
			e.preventDefault()
			const opt = options[highlightedIndex]
			if (opt) onSelect(opt.value)
		} else if (e.key === "Escape" || e.key === "Tab") {
			setOpen(false)
		} else if (e.key.length === 1) {
			const char = e.key.toLowerCase()
			const start = highlightedIndex + 1
			const idx = [
				...options.slice(start),
				...options.slice(0, start),
			].findIndex((o) => o.label.toLowerCase().startsWith(char))
			if (idx !== -1) setHighlightedIndex((idx + start) % count)
		}
	}

	return ReactDOM.createPortal(
		<SelectPortal isOpen={isOpen} onKeyDown={onKeyDown}>
			{children}
		</SelectPortal>,
		document.body,
	)
}
SelectOptions.displayName = "Select.Options"

// ---------- Option ----------

export interface SelectOptionProps {
	value: string
	icon?: React.ReactNode
	description?: string
	disabled?: boolean
	className?: string
	children: React.ReactNode
}

function SelectOption({
	value,
	icon,
	description,
	disabled,
	className,
	children,
}: SelectOptionProps) {
	const {
		selected,
		onSelect,
		highlightedIndex,
		setHighlightedIndex,
		slots,
		options,
		registerOption,
	} = useSelectContext()

	const label = typeof children === "string" ? children : value

	useLayoutEffect(
		() => registerOption(value, label),
		[value, label, registerOption],
	)

	const index = options.findIndex((o) => o.value === value)
	const isSelected = selected === value
	const isHighlighted = index === highlightedIndex

	return (
		<li
			role="option"
			aria-selected={isSelected}
			aria-disabled={disabled}
			data-selected={isSelected ? "" : undefined}
			data-highlighted={isHighlighted ? "" : undefined}
			data-disabled={disabled ? "" : undefined}
			className={cx(slots.option, className)}
			onPointerMove={() => !disabled && setHighlightedIndex(index)}
			onClick={() => !disabled && onSelect(value)}
		>
			{icon && <span className={slots.optionIcon}>{icon}</span>}
			<span
				className={css({
					display: "flex",
					flexDirection: "column",
					flex: 1,
					minWidth: 0,
				})}
			>
				<span className={slots.optionLabel}>{children}</span>
				{description && (
					<span className={slots.optionDescription}>{description}</span>
				)}
			</span>
		</li>
	)
}
SelectOption.displayName = "Select.Option"

// ---------- Dot-notation export ----------

export const Select = Object.assign(SelectRoot, {
	Label: SelectLabel,
	Description: SelectDescription,
	Error: SelectError,
	Trigger: SelectTrigger,
	Options: SelectOptions,
	Option: SelectOption,
})
