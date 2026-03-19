import type * as React from "react"
import { modalRegistry } from "#/features/modals"
import { useModalStore } from "#/stores"

export function ModalRenderer() {
	const { current, close } = useModalStore()

	if (!current) return null

	// Cast is safe: the store's typed `open` ensures id and props are correlated.
	const ModalComponent = modalRegistry[current.id] as React.ComponentType<{
		open: boolean
		onClose: () => void
		[key: string]: unknown
	}>
	return <ModalComponent open={true} onClose={close} {...current.props} />
}
