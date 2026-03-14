import { useEffect, useRef } from "react"

export type ShortcutEntry = {
	shortcut?: string
	handler: () => void
}

const MODIFIER_ALIASES: Record<string, "meta" | "ctrl" | "alt" | "shift"> = {
	meta: "meta",
	cmd: "meta",
	command: "meta",
	ctrl: "ctrl",
	control: "ctrl",
	alt: "alt",
	option: "alt",
	shift: "shift",
}

function normalizeMainKey(key: string) {
	const normalized = key.toLowerCase()

	if (normalized === "esc") return "escape"
	if (normalized === "del") return "delete"
	if (normalized === "return") return "enter"
	if (normalized === "plus") return "+"
	if (normalized === "minus") return "-"

	return normalized
}

function matchesShortcut(event: KeyboardEvent, shortcut?: string) {
	if (!shortcut) return false

	const parts = shortcut
		.split("+")
		.map((part) => part.trim())
		.filter(Boolean)
	if (!parts.length) return false

	const expected = {
		meta: false,
		ctrl: false,
		alt: false,
		shift: false,
	}

	let mainKey: string | null = null

	for (const part of parts) {
		const modifier = MODIFIER_ALIASES[part.toLowerCase()]
		if (modifier) {
			expected[modifier] = true
			continue
		}
		mainKey = normalizeMainKey(part)
	}

	if (event.metaKey !== expected.meta) return false
	if (event.ctrlKey !== expected.ctrl) return false
	if (event.altKey !== expected.alt) return false
	if (event.shiftKey !== expected.shift) return false

	if (!mainKey) return false

	const eventKey = event.key.toLowerCase()
	if (mainKey === "?") {
		return eventKey === "?" || (eventKey === "/" && event.shiftKey)
	}

	if (mainKey === "+") {
		return eventKey === "+" || eventKey === "="
	}

	if (mainKey === "-") {
		return eventKey === "-" || eventKey === "_"
	}

	return eventKey === mainKey
}

export function useKeyboardShortcuts(entries: ShortcutEntry[]) {
	const entriesRef = useRef(entries)
	entriesRef.current = entries

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement ||
				(e.target instanceof HTMLElement && e.target.isContentEditable)
			)
				return

			for (const { shortcut, handler } of entriesRef.current) {
				if (matchesShortcut(e, shortcut)) {
					e.preventDefault()
					handler()
					return
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown, true)
		return () => window.removeEventListener("keydown", handleKeyDown, true)
	}, []) // stable — entriesRef.current is always fresh
}
