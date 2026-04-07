import type * as React from "react"
import { AuthModal } from "./auth-modal"
import { DeleteAccountModal } from "./delete-account-modal"
import { EmbedCodeModal } from "./embed-code-modal"
import { GettingStartedModal } from "./getting-started-modal"
import { ShareProposalModal } from "./share-proposal-modal"
import { ShortcutsModal } from "./shortcuts-modal"
import { ToolRefModal } from "./tool-ref-modal"

export const modalRegistry = {
	auth: AuthModal,
	deleteAccount: DeleteAccountModal,
	embedCode: EmbedCodeModal,
	shortcuts: ShortcutsModal,
	toolRef: ToolRefModal,
	shareProposal: ShareProposalModal,
	gettingStarted: GettingStartedModal,
} as const

/** Props a modal component needs beyond the injected `open` / `onClose`. */
export type ModalExtraProps<K extends keyof typeof modalRegistry> = Omit<
	React.ComponentProps<(typeof modalRegistry)[K]>,
	"open" | "onClose"
>
