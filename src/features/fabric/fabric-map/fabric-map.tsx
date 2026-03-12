import maplibregl from "maplibre-gl"
import { useEffect, useRef, useState } from "react"
import "maplibre-gl/dist/maplibre-gl.css"
import { MapProvider } from "./map-context"
import { buildMapStyle } from "./style"

type Props = {
	center: [number, number] // [lng, lat]
	zoom?: number
	pitch?: number
	children?: React.ReactNode
}

export function FabricMap({ center, zoom = 15, pitch = 0, children }: Props) {
	const containerRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<maplibregl.Map | null>(null)
	const [map, setMap] = useState<maplibregl.Map | null>(null)

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

		setMap(mapRef.current)

		return () => {
			mapRef.current?.remove()
			mapRef.current = null
			setMap(null)
		}
	}, [])

	// Fly to center if it changes after mount rather than remounting
	useEffect(() => {
		if (!mapRef.current) return
		mapRef.current.flyTo({ center, zoom, pitch, duration: 600 })
	}, [center, zoom, pitch])

	return (
		<MapProvider value={map}>
			<div ref={containerRef} style={{ width: "100%", height: "100%" }} />
			{map && children}
		</MapProvider>
	)
}
