import { createLink, type LinkComponentProps } from "@tanstack/react-router"
import * as React from "react"
import { cx } from "@/styles/styled-system/css"
import { type TabsVariantProps, tabs } from "@/styles/styled-system/recipes"

// ---------- Context ----------

interface TabsContextValue {
	value: string | null
	setValue?: (value: string) => void
	styles: ReturnType<typeof tabs>
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext() {
	const ctx = React.useContext(TabsContext)
	if (!ctx) {
		throw new Error(
			"Tabs.Trigger and Tabs.List must be used within <Tabs.Root>",
		)
	}
	return ctx
}

// ---------- Root ----------

interface TabsRootProps
	extends React.HTMLAttributes<HTMLDivElement>,
		TabsVariantProps {
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
}

function TabsRoot({
	value: controlledValue,
	defaultValue,
	onValueChange,
	children,
	className,
	size,
	...rest
}: TabsRootProps) {
	const [uncontrolled, setUncontrolled] = React.useState<string | null>(
		defaultValue ?? null,
	)

	const isControlled = controlledValue !== undefined
	const value = isControlled ? controlledValue : uncontrolled

	const setValue = React.useCallback(
		(next: string) => {
			if (!isControlled) setUncontrolled(next)
			onValueChange?.(next)
		},
		[isControlled, onValueChange],
	)

	const styles = tabs({ size })

	return (
		<TabsContext.Provider value={{ value, setValue, styles }}>
			<div className={cx(styles.root, className)} {...rest}>
				{children}
			</div>
		</TabsContext.Provider>
	)
}

// ---------- List ----------

function TabsList({
	className,
	...rest
}: React.HTMLAttributes<HTMLDivElement>) {
	const { styles } = useTabsContext()
	return <div className={cx(styles.list, className)} role="tablist" {...rest} />
}
TabsList.displayName = "Tabs.List"

// ---------- Trigger ----------

interface TabsTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string
}

function TabsTrigger({ value, className, onClick, ...rest }: TabsTriggerProps) {
	const { value: current, setValue, styles } = useTabsContext()
	const isActive = current === value

	return (
		<button
			type="button"
			role="tab"
			aria-selected={isActive}
			data-state={isActive ? "active" : "inactive"}
			onClick={(e) => {
				setValue?.(value)
				onClick?.(e)
			}}
			className={cx(styles.trigger, className)}
			{...rest}
		/>
	)
}
TabsTrigger.displayName = "Tabs.Trigger"

// ---------- Link (TanStack Router) ----------
// Active state driven by TanStack's data-status="active" on the anchor.

interface TabLinkAnchorProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const TabLinkAnchor = React.forwardRef<HTMLAnchorElement, TabLinkAnchorProps>(
	({ className, ...props }, ref) => {
		const { styles } = useTabsContext()
		return <a ref={ref} className={cx(styles.link, className)} {...props} />
	},
)
TabLinkAnchor.displayName = "TabLinkAnchor"

const CreatedTabLink = createLink(TabLinkAnchor)

type TabsLinkProps = LinkComponentProps<typeof TabLinkAnchor> & {
	exact?: boolean
}

function TabsLink({
	exact,
	activeOptions,
	className,
	...props
}: TabsLinkProps) {
	return (
		<CreatedTabLink
			preload="intent"
			activeOptions={{
				...activeOptions,
				exact: exact ?? activeOptions?.exact,
			}}
			className={className}
			{...props}
		/>
	)
}
TabsLink.displayName = "Tabs.Link"

// ---------- Dot-notation export ----------

export const Tabs = Object.assign(TabsRoot, {
	List: TabsList,
	Trigger: TabsTrigger,
	Link: TabsLink,
})
