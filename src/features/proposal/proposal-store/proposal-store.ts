import { create } from "zustand"
import type { ElementInstance } from "#/features/fabric/element-types/types"

type ProposalStore = {
	isPanelOpen: boolean
	togglePanel: () => void
	activeTab: "about" | "legend"
	setActiveTab: (tab: "about" | "legend") => void
	elements: ElementInstance[]
	initElements: (elements: ElementInstance[]) => void
	selectedInstanceId?: string
	setSelectedInstanceId: (id: string) => void
}

export const useProposalStore = create<ProposalStore>((set) => ({
	isPanelOpen: true,
	togglePanel: () =>
		set((state) => ({
			isPanelOpen: !state.isPanelOpen,
			activeTab: state.isPanelOpen ? "about" : state.activeTab,
		})),
	activeTab: "about",
	setActiveTab: (tab) => set({ activeTab: tab }),
	elements: [],
	initElements: (elements) => set({ elements }),
	selectedInstanceId: undefined,
	setSelectedInstanceId: (id) => set({ selectedInstanceId: id }),
}))
