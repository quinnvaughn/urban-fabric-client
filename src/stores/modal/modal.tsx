import { create } from "zustand"

export type ModalId = "shortcuts" | "toolRef"

// ---------- Store ----------

interface ModalState {
	current: ModalId | null
	open: (id: ModalId) => void
	close: () => void
}

export const useModalStore = create<ModalState>((set) => ({
	current: null,
	open: (id) => set({ current: id }),
	close: () => set({ current: null }),
}))

// Imperative helpers for use outside React (keyboard handlers, etc.)
export const openModal = (id: ModalId) => useModalStore.getState().open(id)
export const closeModal = () => useModalStore.getState().close()
