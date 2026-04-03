import { createStore, useStore } from "@tanstack/react-store"
import { ELEMENT_TYPE_MAP } from "#/features/fabric/element-types"
import type {
	ElementDescriptor,
	ElementInstance,
} from "#/features/fabric/element-types/types"

const panelStore = createStore({
	isPanelOpen: true,
	activeTab: "about" as "about" | "legend" | "comments",
})

const elementsStore = createStore<ElementInstance[]>([])
const selectedInstanceIdStore = createStore<string | undefined>(undefined)

// Derived — unique descriptors for the element types actually present
const activeElementTypesStore = createStore(() => {
	const seen = new Set<string>()
	const descriptors: ElementDescriptor[] = []
	for (const el of elementsStore.state) {
		if (!seen.has(el.typeId)) {
			seen.add(el.typeId)
			const descriptor = ELEMENT_TYPE_MAP[el.typeId]
			if (descriptor) descriptors.push(descriptor)
		}
	}
	return descriptors
})

const selectedInstanceStore = createStore(() => {
	const id = selectedInstanceIdStore.state
	if (!id) return undefined
	return elementsStore.state.find((el) => el.id === id)
})

// Actions
const togglePanel = () =>
	panelStore.setState((s) => ({
		isPanelOpen: !s.isPanelOpen,
		activeTab: !s.isPanelOpen ? s.activeTab : "about",
	}))

const setActiveTab = (tab: "about" | "legend" | "comments") =>
	panelStore.setState((s) => ({ ...s, activeTab: tab }))

const initElements = (elements: ElementInstance[]) =>
	elementsStore.setState(() => elements)

const setSelectedInstanceId = (id: string) =>
	selectedInstanceIdStore.setState(() => id)

export function useProposalStore() {
	const { isPanelOpen, activeTab } = useStore(panelStore, (s) => s)
	const elements = useStore(elementsStore, (s) => s)
	const selectedInstanceId = useStore(selectedInstanceIdStore, (s) => s)
	const activeElementTypes = useStore(activeElementTypesStore, (s) => s)
	const selectedInstance = useStore(selectedInstanceStore, (s) => s)

	return {
		isPanelOpen,
		activeTab,
		elements,
		selectedInstanceId,
		activeElementTypes,
		togglePanel,
		setActiveTab,
		initElements,
		setSelectedInstanceId,
		selectedInstance,
	}
}
