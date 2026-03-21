import { createStore, useStore } from "@tanstack/react-store"
import type { ModalExtraProps, modalRegistry } from "#/features/modals/registry"

export type ModalId = keyof typeof modalRegistry

type ModalEntry = {
	[K in ModalId]: { id: K; props: ModalExtraProps<K> }
}[ModalId]

// ---------- Store ----------

type ModalState = {
	current: ModalEntry | null
}

export const modalStore = createStore<ModalState>({ current: null })

// ── Actions ───────────────────────────────────────────────────────────────────

export function openModal<K extends ModalId>(
	id: K,
	...args: object extends ModalExtraProps<K>
		? [props?: ModalExtraProps<K>]
		: [props: ModalExtraProps<K>]
) {
	modalStore.setState(() => ({
		current: { id, props: args[0] ?? {} } as ModalEntry,
	}))
}

export const closeModal = () =>
	modalStore.setState((s) => ({ ...s, current: null }))

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useModalStore() {
	const { current } = useStore(modalStore, (s) => s)
	return { current, open: openModal, close: closeModal }
}
