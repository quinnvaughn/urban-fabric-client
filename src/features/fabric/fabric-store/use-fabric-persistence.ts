import { useEffect, useRef } from "react"
import type { PersistenceHandler } from "../element-types/types"
import { fabricStore, setSaveStatus, useFabricStore } from "./fabric-store"

const SAVED_RESET_DELAY = 2000
const SAVE_DEBOUNCE_MS = 800

export function useFabricPersistence(handler: PersistenceHandler) {
	const { elements } = useFabricStore()

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const savedResetRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	// biome-ignore lint/correctness/useExhaustiveDependencies: handler is stable
	useEffect(() => {
		// Only save when there are actual unsaved changes — this naturally skips
		// initElements on load since it doesn't set saveStatus to "dirty"
		if (fabricStore.state.saveStatus !== "dirty") return

		if (debounceRef.current) clearTimeout(debounceRef.current)
		if (savedResetRef.current) clearTimeout(savedResetRef.current)

		debounceRef.current = setTimeout(async () => {
			setSaveStatus("saving")
			try {
				await handler.save(elements)
				setSaveStatus("saved")
				savedResetRef.current = setTimeout(
					() => setSaveStatus("idle"),
					SAVED_RESET_DELAY,
				)
			} catch {
				setSaveStatus("error")
			}
		}, SAVE_DEBOUNCE_MS)

		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
		}
	}, [elements])
}
