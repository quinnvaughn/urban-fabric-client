import { useEffect } from "react"
import type { PersistenceHandler } from "../element-types/types"
import { useFabricStore } from "./fabric-store"

export function useFabricPersistence(handler: PersistenceHandler) {
	const elements = useFabricStore((s) => s.elements)

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore
	useEffect(() => {
		handler.save(elements)
	}, [elements])
}
