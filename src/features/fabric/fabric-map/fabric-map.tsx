import maplibregl from "maplibre-gl"
import { useEffect, useRef } from "react"
import "maplibre-gl/dist/maplibre-gl.css"
import { buildMapStyle } from "./style"

type Props = {
	center: [number, number] // [lng, lat] — MapLibre's native order
	zoom?: number
	pitch?: number
}

export function FabricMap({ center, zoom = 15, pitch = 0 }: Props) {
	const containerRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<maplibregl.Map | null>(null)

	// Initialize once — intentionally empty deps
	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore
	useEffect(() => {
		if (!containerRef.current || mapRef.current) return

		mapRef.current = new maplibregl.Map({
			container: containerRef.current,
			style: buildMapStyle(import.meta.env.VITE_PROTOMAPS_KEY),
			center,
			zoom,
			pitch,
			bearing: 0,
			// Remove default controls — you'll add your own HUD
			attributionControl: false,
		})

		// Add attribution in your own position
		mapRef.current.addControl(
			new maplibregl.AttributionControl({ compact: true }),
			"bottom-right",
		)

		return () => {
			mapRef.current?.remove()
			mapRef.current = null
		}
	}, [])

	// Fly to center if it changes after mount rather than remounting
	useEffect(() => {
		if (!mapRef.current) return
		mapRef.current.flyTo({ center, zoom, pitch, duration: 600 })
	}, [center, zoom, pitch])

	return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
}
