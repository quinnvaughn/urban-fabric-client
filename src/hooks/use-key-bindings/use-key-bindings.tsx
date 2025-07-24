import { useCallback, useEffect } from "react"

type KeyBinding = {
	key: string
	shift?: boolean
	ctrl?: boolean
	alt?: boolean
	handler: (event: KeyboardEvent) => void
}

export function useKeyBindings(keyBindings: KeyBinding[]) {
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			keyBindings.forEach(({ key, shift, ctrl, alt, handler }) => {
				const target = event.target as HTMLElement
				const tag = target.tagName
				if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
					// you’re typing in a form field—ignore the hotkey
					return
				}
				if (
					event.key === key &&
					(shift === undefined || event.shiftKey === shift) &&
					(ctrl === undefined || event.ctrlKey === ctrl) &&
					(alt === undefined || event.altKey === alt)
				) {
					event.preventDefault()
					event.stopPropagation()
					handler(event)
				}
			})
		},
		[keyBindings],
	)

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [handleKeyDown])
}
