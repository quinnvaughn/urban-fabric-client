import { createStore, useStore } from "@tanstack/react-store"
import type { ElementDescriptor, ElementInstance } from "../element-types/types"

type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "error"

type FabricState = {
	title: string
	saveStatus: SaveStatus
	activeTool: "select" | "draw"
	activeElement: ElementDescriptor | null
	elements: ElementInstance[]
	selectedInstanceId: string | null
	commandPaletteOpen: boolean
	past: ElementInstance[][]
	future: ElementInstance[][]
	canUndo: boolean
	canRedo: boolean
	canUndoDrawing: boolean
	canRedoDrawing: boolean
}

type DrawingHistoryControls = {
	undo: () => void
	redo: () => void
}

let drawingHistoryControls: DrawingHistoryControls | null = null

export const fabricStore = createStore<FabricState>({
	title: "",
	saveStatus: "idle",
	activeTool: "select",
	activeElement: null,
	elements: [],
	selectedInstanceId: null,
	commandPaletteOpen: false,
	past: [],
	future: [],
	canUndo: false,
	canRedo: false,
	canUndoDrawing: false,
	canRedoDrawing: false,
})

// ── Actions ───────────────────────────────────────────────────────────────────

export const initTitle = (title: string) =>
	fabricStore.setState((s) => ({ ...s, title }))

export const setTitle = (title: string) =>
	fabricStore.setState((s) => ({ ...s, title, saveStatus: "dirty" as const }))

export const setSaveStatus = (status: SaveStatus) =>
	fabricStore.setState((s) => ({ ...s, saveStatus: status }))

export const setActiveElement = (element: ElementDescriptor | null) =>
	fabricStore.setState((s) => ({ ...s, activeElement: element }))

export const setActiveTool = (tool: "select" | "draw") =>
	fabricStore.setState((s) => ({ ...s, activeTool: tool }))

export const initElements = (elements: ElementInstance[]) =>
	fabricStore.setState((s) => ({ ...s, elements }))

export const setSelectedInstanceId = (id: string | null) =>
	fabricStore.setState((s) => ({ ...s, selectedInstanceId: id }))

export const openCommandPalette = () =>
	fabricStore.setState((s) => ({ ...s, commandPaletteOpen: true }))

export const closeCommandPalette = () =>
	fabricStore.setState((s) => ({ ...s, commandPaletteOpen: false }))

export const setDrawingHistoryControls = (
	controls: DrawingHistoryControls | null,
) => {
	drawingHistoryControls = controls
}

export const setDrawingHistoryAvailability = ({
	canUndo,
	canRedo,
}: {
	canUndo: boolean
	canRedo: boolean
}) =>
	fabricStore.setState((s) => ({
		...s,
		canUndoDrawing: canUndo,
		canRedoDrawing: canRedo,
	}))

export const clearDrawingHistoryControls = () => {
	drawingHistoryControls = null
	setDrawingHistoryAvailability({ canUndo: false, canRedo: false })
}

export const undoDrawing = () => {
	drawingHistoryControls?.undo()
}

export const redoDrawing = () => {
	drawingHistoryControls?.redo()
}

export const addElement = (element: ElementInstance) =>
	fabricStore.setState((s) => ({
		...s,
		elements: [...s.elements, element],
		past: [...s.past.slice(-49), s.elements],
		future: [],
		canUndo: true,
		canRedo: false,
		saveStatus: "dirty" as const,
	}))

export const updateElement = (id: string, updates: Partial<ElementInstance>) =>
	fabricStore.setState((s) => ({
		...s,
		elements: s.elements.map((el) =>
			el.id === id ? { ...el, ...updates } : el,
		),
		saveStatus: "dirty" as const,
	}))

export const deleteElement = (id: string) =>
	fabricStore.setState((s) => ({
		...s,
		elements: s.elements.filter((el) => el.id !== id),
		past: [...s.past.slice(-49), s.elements],
		future: [],
		canUndo: true,
		canRedo: false,
		saveStatus: "dirty" as const,
	}))

export const snapshot = () =>
	fabricStore.setState((s) => ({
		...s,
		past: [...s.past.slice(-49), s.elements],
		future: [],
		canUndo: true,
		canRedo: false,
	}))

export const undo = () =>
	fabricStore.setState((s) => {
		if (!s.past.length) return s
		const previous = s.past[s.past.length - 1]
		return {
			...s,
			elements: previous,
			past: s.past.slice(0, -1),
			future: [s.elements, ...s.future],
			canUndo: s.past.length - 1 > 0,
			canRedo: true,
			saveStatus: "dirty" as const,
		}
	})

export const redo = () =>
	fabricStore.setState((s) => {
		if (!s.future.length) return s
		return {
			...s,
			elements: s.future[0],
			past: [...s.past, s.elements],
			future: s.future.slice(1),
			canUndo: true,
			canRedo: s.future.length - 1 > 0,
			saveStatus: "dirty" as const,
		}
	})

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useFabricStore() {
	const state = useStore(fabricStore, (s) => s)
	return {
		...state,
		initTitle,
		setTitle,
		setSaveStatus,
		setActiveElement,
		setActiveTool,
		initElements,
		setSelectedInstanceId,
		openCommandPalette,
		closeCommandPalette,
		addElement,
		updateElement,
		deleteElement,
		snapshot,
		undo,
		redo,
		setDrawingHistoryControls,
		setDrawingHistoryAvailability,
		clearDrawingHistoryControls,
		undoDrawing,
		redoDrawing,
	}
}
