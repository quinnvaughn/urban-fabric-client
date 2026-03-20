import { Search } from "lucide-react"
import type * as React from "react"
import { css, cx } from "@/styles/styled-system/css"
import { filterBar as filterBarRecipe } from "@/styles/styled-system/recipes"
import { Input } from "../input"

// ---------- Slots ----------

const slots = filterBarRecipe()

// ---------- Root ----------

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {}

function FilterBarRoot({ className, children, ...rest }: FilterBarProps) {
	return (
		<div className={cx(slots.root, className)} {...rest}>
			{children}
		</div>
	)
}
FilterBarRoot.displayName = "FilterBar"

// ---------- Search ----------

export interface FilterBarSearchProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	className?: string
}

function FilterBarSearch({
	value,
	onChange,
	placeholder = "Search…",
	className,
}: FilterBarSearchProps) {
	return (
		<Input variant="ghost" size="lg" className={css({ paddingInline: "1" })}>
			<Input.Field
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className={className}
				startAdornment={<Search size={14} />}
			/>
		</Input>
	)
}
FilterBarSearch.displayName = "FilterBar.Search"

// ---------- Filters ----------

export interface FilterBarFiltersProps
	extends React.HTMLAttributes<HTMLDivElement> {}

function FilterBarFilters({
	className,
	children,
	...rest
}: FilterBarFiltersProps) {
	return (
		<div className={cx(slots.filtersRow, className)} {...rest}>
			{children}
		</div>
	)
}
FilterBarFilters.displayName = "FilterBar.Filters"

// ---------- Separator ----------

export interface FilterBarSeparatorProps
	extends React.HTMLAttributes<HTMLDivElement> {}

function FilterBarSeparator({ className, ...rest }: FilterBarSeparatorProps) {
	return <div className={cx(slots.separator, className)} {...rest} />
}
FilterBarSeparator.displayName = "FilterBar.Separator"

// ---------- Dot-notation export ----------

export const FilterBar = Object.assign(FilterBarRoot, {
	Search: FilterBarSearch,
	Filters: FilterBarFilters,
	Separator: FilterBarSeparator,
})
