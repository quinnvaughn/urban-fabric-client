import { createStore, useStore } from "@tanstack/react-store"
import { ELEMENT_TYPE_MAP } from "#/features/fabric/element-types"
import type {
	ElementDescriptor,
	ElementInstance,
} from "#/features/fabric/element-types/types"

export enum ProposalPanelTab {
	About = "about",
	Layers = "layers",
	Photos = "photos",
	Comments = "comments",
}

const panelStore = createStore({
	isPanelOpen: true,
	activeTab: ProposalPanelTab.About,
})

const elementsStore = createStore<ElementInstance[]>([])
const hiddenTypeIdsStore = createStore<string[]>([])
const selectedInstanceIdStore = createStore<string | undefined>(undefined)
type ActiveCommentLocation = {
	commentId: string
	name: string
	lat: number
	lng: number
}
const activeCommentLocationStore = createStore<ActiveCommentLocation | null>(
	null,
)

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

const visibleElementsStore = createStore(() => {
	const hiddenTypeIds = new Set(hiddenTypeIdsStore.state)
	return elementsStore.state.filter((el) => !hiddenTypeIds.has(el.typeId))
})

// Actions
const togglePanel = () =>
	panelStore.setState((s) => ({
		isPanelOpen: !s.isPanelOpen,
		activeTab: !s.isPanelOpen ? s.activeTab : ProposalPanelTab.About,
	}))

const openPanel = () =>
	panelStore.setState((s) => ({
		...s,
		isPanelOpen: true,
	}))

const closePanel = () =>
	panelStore.setState((s) => ({
		...s,
		isPanelOpen: false,
		activeTab: ProposalPanelTab.About,
	}))

const setActiveTab = (tab: ProposalPanelTab) =>
	panelStore.setState((s) => ({ ...s, activeTab: tab }))

const initElements = (elements: ElementInstance[]) => {
	elementsStore.setState(() => elements)
	hiddenTypeIdsStore.setState(() => [])
}

const setSelectedInstanceId = (id: string) =>
	selectedInstanceIdStore.setState(() => id)

const toggleTypeVisibility = (typeId: string) =>
	hiddenTypeIdsStore.setState((hiddenTypeIds) =>
		hiddenTypeIds.includes(typeId)
			? hiddenTypeIds.filter((id) => id !== typeId)
			: [...hiddenTypeIds, typeId],
	)

const setTypesVisibility = (typeIds: string[], isVisible: boolean) =>
	hiddenTypeIdsStore.setState((hiddenTypeIds) => {
		const typeIdSet = new Set(typeIds)

		if (isVisible) {
			return hiddenTypeIds.filter((id) => !typeIdSet.has(id))
		}

		return [...new Set([...hiddenTypeIds, ...typeIds])]
	})

const setActiveCommentLocation = (location: ActiveCommentLocation | null) =>
	activeCommentLocationStore.setState(() => location)

export function useProposalStore() {
	const { isPanelOpen, activeTab } = useStore(panelStore, (s) => s)
	const elements = useStore(elementsStore, (s) => s)
	const hiddenTypeIds = useStore(hiddenTypeIdsStore, (s) => s)
	const selectedInstanceId = useStore(selectedInstanceIdStore, (s) => s)
	const activeCommentLocation = useStore(activeCommentLocationStore, (s) => s)
	const activeElementTypes = useStore(activeElementTypesStore, (s) => s)
	const selectedInstance = useStore(selectedInstanceStore, (s) => s)
	const visibleElements = useStore(visibleElementsStore, (s) => s)

	return {
		isPanelOpen,
		activeTab,
		elements,
		hiddenTypeIds,
		visibleElements,
		selectedInstanceId,
		activeElementTypes,
		togglePanel,
		openPanel,
		closePanel,
		setActiveTab,
		initElements,
		setSelectedInstanceId,
		toggleTypeVisibility,
		setTypesVisibility,
		activeCommentLocation,
		setActiveCommentLocation,
		selectedInstance,
	}
}

export type { ActiveCommentLocation }
