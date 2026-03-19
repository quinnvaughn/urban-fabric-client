import { create } from "zustand"
import type {
	ModalExtraProps,
	modalRegistry,
} from "#/features/modals/registry"

export type ModalId = keyof typeof modalRegistry

type ModalEntry = {
	[K in ModalId]: { id: K; props: ModalExtraProps<K> }
}[ModalId]

// ---------- Store ----------

interface ModalState {
	current: ModalEntry | null
	open: <K extends ModalId>(
		id: K,
		...args: object extends ModalExtraProps<K>
			? [props?: ModalExtraProps<K>]
			: [props: ModalExtraProps<K>]
	) => void
	close: () => void
}

export const useModalStore = create<ModalState>((set) => ({
	current: null,
	open: (id, ...args) =>
		set({ current: { id, props: args[0] ?? {} } as ModalEntry }),
	close: () => set({ current: null }),
}))

// Imperative helpers for use outside React (keyboard handlers, etc.)
export function openModal<K extends ModalId>(
	id: K,
	...args: object extends ModalExtraProps<K>
		? [props?: ModalExtraProps<K>]
		: [props: ModalExtraProps<K>]
) {
	useModalStore.getState().open(id, ...(args as [ModalExtraProps<K>]))
}
export const closeModal = () => useModalStore.getState().close()
