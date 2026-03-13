import { useEffect, useRef } from "react"

type ShortcutEntry = {
	shortcut?: string
	handler: () => void
}

export function useKeyboardShortcuts(entries: ShortcutEntry[]) {
	const entriesRef = useRef(entries)
	entriesRef.current = entries

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (
				e.metaKey ||
				e.ctrlKey ||
				e.altKey ||
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement ||
				(e.target instanceof HTMLElement && e.target.isContentEditable)
			)
				return

			for (const { shortcut, handler } of entriesRef.current) {
				if (shortcut && e.key === shortcut) {
					handler()
					return
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown, true)
		return () => window.removeEventListener("keydown", handleKeyDown, true)
	}, []) // stable — entriesRef.current is always fresh
}
