import * as React from "react"
import { createPortal } from "react-dom"
import { cx } from "@/styles/styled-system/css"
import { toast as toastRecipe } from "@/styles/styled-system/recipes"

// ---------- Types ----------

export type ToastIntent = "success" | "error" | "warning" | "info"

export interface ToastOptions {
	id?: string
	title: string
	description?: string
	intent?: ToastIntent
	duration?: number // ms — default 4000, use Infinity to persist
	size?: "md" | "compact"
}

interface ToastItem extends Required<Omit<ToastOptions, "description">> {
	description?: string
	closing: boolean
}

// ---------- Icons ----------

const icons: Record<ToastIntent, React.ReactNode> = {
	success: (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true"
		>
			<circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
			<path
				d="M5 8l2 2 4-4"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	error: (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true"
		>
			<circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
			<path
				d="M6 6l4 4M10 6l-4 4"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	),
	warning: (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M8 2L14.5 13H1.5L8 2z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
			<path
				d="M8 6.5v3"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<circle cx="8" cy="11" r="0.75" fill="currentColor" />
		</svg>
	),
	info: (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true"
		>
			<circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
			<path
				d="M8 7v4"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<circle cx="8" cy="5" r="0.75" fill="currentColor" />
		</svg>
	),
}

// ---------- Context ----------

interface ToastContextValue {
	add: (opts: ToastOptions) => string
	dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

// ---------- Provider ----------

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = React.useState<ToastItem[]>([])

	const dismiss = React.useCallback((id: string) => {
		// Mark as closing — triggers exit animation
		setToasts((prev) =>
			prev.map((t) => (t.id === id ? { ...t, closing: true } : t)),
		)
		// Remove from DOM after animation completes
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id))
		}, 200)
	}, [])

	const add = React.useCallback(
		(opts: ToastOptions): string => {
			const id = opts.id ?? crypto.randomUUID()
			const item: ToastItem = {
				id,
				title: opts.title,
				description: opts.description,
				intent: opts.intent ?? "info",
				duration: opts.duration ?? 4000,
				size: opts.size ?? "md",
				closing: false,
			}

			setToasts((prev) => {
				// If same id already exists, replace it
				const exists = prev.some((t) => t.id === id)
				return exists
					? prev.map((t) => (t.id === id ? { ...item, closing: false } : t))
					: [...prev, item]
			})

			if (item.duration !== Infinity) {
				setTimeout(() => dismiss(id), item.duration)
			}

			return id
		},
		[dismiss],
	)

	return (
		<ToastContext.Provider value={{ add, dismiss }}>
			{children}
			<Toaster toasts={toasts} onDismiss={dismiss} />
		</ToastContext.Provider>
	)
}

// ---------- Hook ----------

export function useToast() {
	const ctx = React.useContext(ToastContext)
	if (!ctx) throw new Error("useToast must be used within <ToastProvider>")

	return React.useMemo(
		() => ({
			toast: ctx.add,
			dismiss: ctx.dismiss,
			// Convenience shorthands
			success: (title: string, opts?: Omit<ToastOptions, "title" | "intent">) =>
				ctx.add({ ...opts, title, intent: "success" }),
			error: (title: string, opts?: Omit<ToastOptions, "title" | "intent">) =>
				ctx.add({ ...opts, title, intent: "error" }),
			warning: (title: string, opts?: Omit<ToastOptions, "title" | "intent">) =>
				ctx.add({ ...opts, title, intent: "warning" }),
			info: (title: string, opts?: Omit<ToastOptions, "title" | "intent">) =>
				ctx.add({ ...opts, title, intent: "info" }),
		}),
		[ctx],
	)
}

// ---------- Toaster (portal container) ----------

function Toaster({
	toasts,
	onDismiss,
}: {
	toasts: ToastItem[]
	onDismiss: (id: string) => void
}) {
	if (typeof document === "undefined") return null

	return createPortal(
		<div
			aria-live="polite"
			style={{
				position: "fixed",
				bottom: 24,
				right: 24,
				display: "flex",
				flexDirection: "column",
				gap: 8,
				zIndex: 9999,
				pointerEvents: "none",
			}}
		>
			{toasts.map((t) => (
				<ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
			))}
		</div>,
		document.body,
	)
}

// ---------- Single toast ----------

function ToastItem({
	toast: t,
	onDismiss,
}: {
	toast: ToastItem
	onDismiss: (id: string) => void
}) {
	const isCompact = t.size === "compact"

	return (
		<output
			data-closing={t.closing ? "" : undefined}
			className={cx(toastRecipe({ intent: t.intent, size: t.size }))}
		>
			{/* Icon */}
			<span
				style={{
					display: "flex",
					alignItems: "center",
					paddingTop: 1,
					flexShrink: 0,
					opacity: 0.85,
				}}
			>
				{icons[t.intent]}
			</span>

			{/* Body */}
			<div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<span
					style={{
						fontSize: isCompact ? 13 : 14,
						fontWeight: 500,
						lineHeight: 1.3,
						letterSpacing: "-0.01em",
					}}
				>
					{t.title}
				</span>
				{t.description && (
					<span
						style={{
							fontSize: isCompact ? 12 : 13,
							opacity: 0.75,
							lineHeight: 1.45,
						}}
					>
						{t.description}
					</span>
				)}
			</div>

			{/* Dismiss */}
			<button
				type="button"
				onClick={() => onDismiss(t.id)}
				aria-label="Dismiss notification"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: 20,
					height: 20,
					borderRadius: 4,
					border: "none",
					background: "transparent",
					cursor: "pointer",
					opacity: 0.45,
					flexShrink: 0,
					paddingTop: 1,
					transition: "opacity 0.12s",
				}}
				onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85" }}
				onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.45" }}
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="M2 2l8 8M10 2l-8 8"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</svg>
			</button>
		</output>
	)
}
