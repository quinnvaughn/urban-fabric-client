import { create } from "zustand"
import type { ElementDescriptor, ElementInstance } from "../element-types/types"

type FabricStore = {
	activeTool: "select" | "draw"
	activeElement: ElementDescriptor | null
	setActiveElement: (element: ElementDescriptor | null) => void
	setActiveTool: (tool: "select" | "draw") => void

	elements: ElementInstance[]
	addElement: (element: ElementInstance) => void
	updateElement: (id: string, updates: Partial<ElementInstance>) => void
	deleteElement: (id: string) => void

	selectedInstanceId: string | null
	setSelectedInstanceId: (id: string | null) => void
}

export const useFabricStore = create<FabricStore>((set) => ({
	activeElement: null,
	activeTool: "select",
	elements: [],
	selectedInstanceId: null,
	setActiveElement: (element) => set({ activeElement: element }),
	setActiveTool: (tool) => set({ activeTool: tool }),
	addElement: (element) =>
		set((state) => ({ elements: [...state.elements, element] })),
	updateElement: (id, updates) =>
		set((state) => ({
			elements: state.elements.map((el) =>
				el.id === id ? { ...el, ...updates } : el,
			),
		})),
	deleteElement: (id) =>
		set((state) => ({
			elements: state.elements.filter((el) => el.id !== id),
		})),
	setSelectedInstanceId: (id) => set({ selectedInstanceId: id }),
}))
