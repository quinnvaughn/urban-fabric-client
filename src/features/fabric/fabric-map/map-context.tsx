import type maplibregl from "maplibre-gl"
import { createContext, useContext } from "react"

const MapContext = createContext<maplibregl.Map | null>(null)

export const MapProvider = MapContext.Provider

export function useMap(): maplibregl.Map {
	const map = useContext(MapContext)
	if (!map) throw new Error("useMap must be used inside FabricMap")
	return map
}
