import { ShortcutsModal } from "./shortcuts-modal"
import { ToolRefModal } from "./tool-ref-modal"

export const modalRegistry = {
	shortcuts: ShortcutsModal,
	toolRef: ToolRefModal,
} as const
