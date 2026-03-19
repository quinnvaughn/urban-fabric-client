import type * as React from "react"
import { ShareProposalModal } from "./share-proposal-modal"
import { ShortcutsModal } from "./shortcuts-modal"
import { ToolRefModal } from "./tool-ref-modal"

export const modalRegistry = {
	shortcuts: ShortcutsModal,
	toolRef: ToolRefModal,
	shareProposal: ShareProposalModal,
} as const

/** Props a modal component needs beyond the injected `open` / `onClose`. */
export type ModalExtraProps<K extends keyof typeof modalRegistry> = Omit<
	React.ComponentProps<(typeof modalRegistry)[K]>,
	"open" | "onClose"
>
