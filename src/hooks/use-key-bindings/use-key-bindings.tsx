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
				if (
					event.key === key &&
					(shift === undefined || event.shiftKey === shift) &&
					(ctrl === undefined || event.ctrlKey === ctrl) &&
					(alt === undefined || event.altKey === alt)
				) {
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
