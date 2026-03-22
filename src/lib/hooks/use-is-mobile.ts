import { useCallback, useSyncExternalStore } from "react"

export type MobileGateSize = "sm" | "md" | "lg" | "xl"

const MIN_WIDTHS: Record<MobileGateSize, number> = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
}

export function useIsMobile(size: MobileGateSize = "sm") {
	const query = `(max-width: ${MIN_WIDTHS[size] - 1}px)`

	const subscribe = useCallback(
		(callback: () => void) => {
			const mql = window.matchMedia(query)
			mql.addEventListener("change", callback)
			return () => mql.removeEventListener("change", callback)
		},
		[query],
	)

	const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

	return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
