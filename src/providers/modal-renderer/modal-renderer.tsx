import { modalRegistry } from "#/features/modals"
import { useModalStore } from "#/stores"

export function ModalRenderer() {
	const { current, close } = useModalStore()

	if (!current) return null

	const ModalComponent = modalRegistry[current]
	return <ModalComponent open={true} onClose={close} />
}
