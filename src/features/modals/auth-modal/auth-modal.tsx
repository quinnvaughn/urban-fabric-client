import { useState } from "react"
import { AuthForm } from "#/features/auth"
import { Modal } from "#/features/ui"

type Props = {
	open: boolean
	onClose: () => void
	initialMode?: "login" | "register"
	onAuthSuccess?: () => Promise<void> | void
	title?: string
}

export function AuthModal({
	open,
	onClose,
	initialMode = "register",
	onAuthSuccess,
	title,
}: Props) {
	const [mode, setMode] = useState<"login" | "register">(initialMode)

	return (
		<Modal open={open} onClose={onClose} size="lg">
			<Modal.Header>
				{title ? <Modal.Title>{title}</Modal.Title> : <div />}
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
