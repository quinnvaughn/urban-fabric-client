import { create } from "zustand"
import type { ElementDescriptor, ElementInstance } from "../element-types/types"

type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "error"

type FabricStore = {
	title: string
	initTitle: (title: string) => void
	setTitle: (title: string) => void
	saveStatus: SaveStatus
	setSaveStatus: (status: SaveStatus) => void
	activeTool: "select" | "draw"
	activeElement: ElementDescriptor | null
	setActiveElement: (element: ElementDescriptor | null) => void
	setActiveTool: (tool: "select" | "draw") => void
	drawHint: string[] | null
	setDrawHint: (hint: string[] | null) => void
	elements: ElementInstance[]
	initElements: (elements: ElementInstance[]) => void
	addElement: (element: ElementInstance) => void
	updateElement: (id: string, updates: Partial<ElementInstance>) => void
	deleteElement: (id: string) => void

	selectedInstanceId: string | null
	setSelectedInstanceId: (id: string | null) => void
}

export const useFabricStore = create<FabricStore>((set) => ({
	activeElement: null,
	activeTool: "select",
	saveStatus: "idle",
	setSaveStatus: (status) => set({ saveStatus: status }),
	title: "",
	initTitle: (title) => set({ title }),
	elements: [],
	drawHint: null,
	setDrawHint: (hint) => set({ drawHint: hint }),
	selectedInstanceId: null,
	setActiveElement: (element) => set({ activeElement: element }),
	setActiveTool: (tool) => set({ activeTool: tool }),
	setTitle: (title) => set({ title, saveStatus: "dirty" }),
	initElements: (elements) => set({ elements }),
	addElement: (element) =>
		set((state) => ({
			elements: [...state.elements, element],
			saveStatus: "dirty",
		})),
	updateElement: (id, updates) =>
		set((state) => ({
			elements: state.elements.map((el) =>
				el.id === id ? { ...el, ...updates } : el,
			),
			saveStatus: "dirty",
		})),
	deleteElement: (id) =>
		set((state) => ({
			elements: state.elements.filter((el) => el.id !== id),
			saveStatus: "dirty",
		})),
	setSelectedInstanceId: (id) => set({ selectedInstanceId: id }),
}))
