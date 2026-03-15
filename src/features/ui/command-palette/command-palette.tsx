import { Search } from "lucide-react"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { cx } from "@/styles/styled-system/css"
import { commandPalette as paletteRecipe } from "@/styles/styled-system/recipes"

// ---------- Types ----------

export interface PaletteItem {
	id: string
	label: string
	/** Color swatch — hex string */
	color?: string
	/** Short description shown to the right of the label */
	description?: string
	/** Arbitrary grouping label rendered as a section header */
	group?: string
	onSelect: () => void
}

export interface CommandPaletteProps {
	open: boolean
	onClose: () => void
	items: PaletteItem[]
	placeholder?: string
}

// ---------- Grouping helper ----------

function groupItems(
	items: PaletteItem[],
): { group: string | null; items: PaletteItem[] }[] {
	const groups: Map<string | null, PaletteItem[]> = new Map()
	for (const item of items) {
		const key = item.group ?? null
		if (!groups.has(key)) groups.set(key, [])
		groups.get(key)?.push(item)
	}
	return Array.from(groups.entries()).map(([group, items]) => ({
		group,
		items,
	}))
}

// ---------- Component ----------

const styles = paletteRecipe()

export function CommandPalette({
	open,
	onClose,
	items,
	placeholder = "Search elements...",
}: CommandPaletteProps) {
	const [query, setQuery] = React.useState("")
	const [activeIdx, setActiveIdx] = React.useState(0)
	const inputRef = React.useRef<HTMLInputElement>(null)

	// Filtered flat list
	const filtered = React.useMemo(() => {
		const q = query.toLowerCase()
		return q
			? items.filter(
					(item) =>
						item.label.toLowerCase().includes(q) ||
						item.description?.toLowerCase().includes(q),
				)
			: items
	}, [query, items])

	const clampedActive = Math.min(activeIdx, Math.max(filtered.length - 1, 0))

	// Reset on open
	React.useEffect(() => {
		if (!open) return
		setQuery("")
		setActiveIdx(0)
		requestAnimationFrame(() => inputRef.current?.focus())
	}, [open])

	// Keyboard navigation
	React.useEffect(() => {
		if (!open) return
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "ArrowDown") {
				e.preventDefault()
				setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
			}
			if (e.key === "ArrowUp") {
				e.preventDefault()
				setActiveIdx((i) => Math.max(i - 1, 0))
			}
			if (e.key === "Enter") {
				e.preventDefault()
				filtered[clampedActive]?.onSelect()
				onClose()
			}
			if (e.key === "Escape") {
				onClose()
			}
		}
		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [open, filtered, clampedActive, onClose])

	if (!open) return null

	const groups = groupItems(filtered)
	// Running index across groups for active tracking
	let runningIdx = 0

	return ReactDOM.createPortal(
		<div
			className={styles.backdrop}
			onPointerDown={(e) => {
				if (e.target === e.currentTarget) onClose()
			}}
		>
			<div
				className={styles.panel}
				role="dialog"
				aria-modal="true"
				aria-label="Command palette"
			>
				{/* Search input */}
				<div className={styles.inputRow}>
					<Search size={14} />
					<input
						ref={inputRef}
						className={styles.input}
						value={query}
						onChange={(e) => {
							setQuery(e.target.value)
							setActiveIdx(0)
						}}
						placeholder={placeholder}
						autoComplete="off"
						spellCheck={false}
					/>
				</div>

				{/* Results */}
				<div className={styles.results}>
					{filtered.length === 0 ? (
						<div className={styles.empty}>No elements match</div>
					) : (
						groups.map(({ group, items: groupItems }) => (
							<div key={group ?? "__ungrouped"}>
								{group && <div className={styles.sectionLabel}>{group}</div>}
								{groupItems.map((item) => {
									const idx = runningIdx++
									const isActive = idx === clampedActive
									return (
										<button
											key={item.id}
											className={cx(styles.item)}
											{...(isActive ? { "data-active": "" } : {})}
											onMouseEnter={() => setActiveIdx(idx)}
											onClick={() => {
												item.onSelect()
												onClose()
											}}
										>
											{item.color && (
												<span
													className={styles.itemSwatch}
													style={{ background: item.color }}
												/>
											)}
											<span data-slot="label" className={styles.itemLabel}>
												{item.label}
											</span>
											{item.description && (
												<span className={styles.itemDesc}>
													{item.description}
												</span>
											)}
										</button>
									)
								})}
							</div>
						))
					)}
				</div>

				{/* Footer hints */}
				<div className={styles.footer}>
					<div className={styles.footerHint}>
						<kbd className={styles.footerKey}>↑</kbd>
						<kbd className={styles.footerKey}>↓</kbd>
						navigate
					</div>
					<div className={styles.footerHint}>
						<kbd className={styles.footerKey}>↵</kbd>
						select &amp; draw
					</div>
					<div className={cx(styles.footerHint)} style={{ marginLeft: "auto" }}>
						<kbd className={styles.footerKey}>Esc</kbd>
						close
					</div>
				</div>
			</div>
		</div>,
		document.body,
	)
}
