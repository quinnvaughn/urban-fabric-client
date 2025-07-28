import { createContext, useContext, useState } from "react"
import { css } from "../../styles/styled-system/css"

type ToastProps = {
	message: string
	duration?: number
	intent?: "success" | "danger" | "info"
	id: string
	onClose?: () => void
}

const ToastContext = createContext<{
	toasts: ToastProps[]
	addToast: (toast: ToastPropsWithoutId) => void
} | null>(null)

type ToastPropsWithoutId = Omit<ToastProps, "id">

export function useToast() {
	const context = useContext(ToastContext)
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider")
	}
	return context
}

function generateId() {
	return Math.random().toString(36).substr(2, 9)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<ToastProps[]>([])

	const addToast = ({ duration = 3000, ...toast }: ToastPropsWithoutId) => {
		const id = generateId()
		setToasts((prev) => [...prev, { ...toast, duration, id }])
		if (duration) {
			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id))
				if (toast.onClose) {
					toast.onClose()
				}
			}, duration)
		}
	}

	return (
		<ToastContext.Provider value={{ toasts, addToast }}>
			{children}
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={css({
						position: "fixed",
						bottom: "1rem",
						right: "1rem",
						zIndex: 1000,
					})}
				>
					<div
						className={css({
							padding: "md",
							borderRadius: "md",
							backgroundColor:
								toast.intent === "success"
									? "success"
									: toast.intent === "danger"
										? "error"
										: "info",
							color: "white",
							mb: "sm",
							boxShadow: "md",
						})}
					>
						{toast.message}
					</div>
				</div>
			))}
		</ToastContext.Provider>
	)
}
