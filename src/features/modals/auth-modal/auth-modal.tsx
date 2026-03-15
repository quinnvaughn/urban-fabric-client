import { useState } from "react"
import { AuthForm } from "#/features/auth"
import { Modal } from "#/features/ui"

type Props = {
	open: boolean
	onClose: () => void
	initialMode?: "login" | "register"
	onAuthSuccess?: () => Promise<void> | void
}

export function AuthModal({
	open,
	onClose,
	initialMode = "register",
	onAuthSuccess,
}: Props) {
	const [mode, setMode] = useState<"login" | "register">(initialMode)

	return (
		<Modal open={open} onClose={onClose} size="lg">
			<Modal.Header>
				<Modal.Title>
					{mode === "login" ? "Sign in" : "Create account"}
				</Modal.Title>
				<Modal.CloseBtn />
			</Modal.Header>
			<Modal.Body>
				<AuthForm
					key={mode}
					mode={mode}
					onModeChange={setMode}
					onAuthSuccess={onAuthSuccess}
				/>
			</Modal.Body>
		</Modal>
	)
}
