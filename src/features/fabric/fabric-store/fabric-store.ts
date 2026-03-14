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
	elements: ElementInstance[]
	initElements: (elements: ElementInstance[]) => void
	addElement: (element: ElementInstance) => void
	updateElement: (id: string, updates: Partial<ElementInstance>) => void
	deleteElement: (id: string) => void
	selectedInstanceId: string | null
	setSelectedInstanceId: (id: string | null) => void

	past: ElementInstance[][]
	future: ElementInstance[][]
	canUndo: boolean
	canRedo: boolean
	snapshot: () => void
	undo: () => void
	redo: () => void
}

export const useFabricStore = create<FabricStore>((set) => ({
	activeElement: null,
	activeTool: "select",
	saveStatus: "idle",
	setSaveStatus: (status) => set({ saveStatus: status }),
	title: "",
	initTitle: (title) => set({ title }),
	elements: [],
	selectedInstanceId: null,
	setActiveElement: (element) => set({ activeElement: element }),
	setActiveTool: (tool) => set({ activeTool: tool }),
	setTitle: (title) => set({ title, saveStatus: "dirty" }),
	initElements: (elements) => set({ elements }),
	addElement: (element) =>
		set((state) => ({
			elements: [...state.elements, element],
			past: [...state.past.slice(-49), state.elements],
			future: [],
			canUndo: true,
			canRedo: false,
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
			past: [...state.past.slice(-49), state.elements],
			future: [],
			canUndo: true,
			canRedo: false,
			saveStatus: "dirty",
		})),
	setSelectedInstanceId: (id) => set({ selectedInstanceId: id }),

	past: [],
	future: [],
	canUndo: false,
	canRedo: false,
	snapshot: () =>
		set((state) => ({
			past: [...state.past.slice(-49), state.elements],
			future: [],
			canUndo: true,
			canRedo: false,
		})),
	undo: () =>
		set((state) => {
			if (!state.past.length) return state
			const previous = state.past[state.past.length - 1]
			return {
				elements: previous,
				past: state.past.slice(0, -1),
				future: [state.elements, ...state.future],
				canUndo: state.past.length - 1 > 0,
				canRedo: true,
				saveStatus: "dirty",
			}
		}),
	redo: () =>
		set((state) => {
			if (!state.future.length) return state
			const next = state.future[0]
			return {
				elements: next,
				past: [...state.past, state.elements],
				future: state.future.slice(1),
				canUndo: true,
				canRedo: state.future.length - 1 > 0,
				saveStatus: "dirty",
			}
		}),
}))
