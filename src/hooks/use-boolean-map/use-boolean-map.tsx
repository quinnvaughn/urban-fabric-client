import { useState } from "react"

export function useBooleanMap<T extends string>(keys: T[]) {
	const [state, setState] = useState<Record<T, boolean>>(
		Object.fromEntries(keys.map((key) => [key, false])) as Record<T, boolean>,
	)

	const toggle = (key: T) => {
		setState((prev) => ({ ...prev, [key]: !prev[key] }))
	}

	return [state, toggle] as const
}
