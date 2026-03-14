import maplibregl from "maplibre-gl"
import { useEffect, useRef, useState } from "react"
import "maplibre-gl/dist/maplibre-gl.css"
import { MapProvider } from "./map-context"

type Props = {
	center: [number, number] // [lng, lat]
	zoom?: number
	bearing?: number
	children?: React.ReactNode
}

export function FabricMap({ center, zoom = 15, bearing = 0, children }: Props) {
	const containerRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<maplibregl.Map | null>(null)
	const [map, setMap] = useState<maplibregl.Map | null>(null)
	const [styleLoaded, setStyleLoaded] = useState(false)

	// Initialize once — intentionally empty deps
	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore
	useEffect(() => {
		if (!containerRef.current || mapRef.current) return

		mapRef.current = new maplibregl.Map({
			container: containerRef.current,
			style: `https://tiles.stadiamaps.com/styles/osm_bright.json?api_key=${import.meta.env.VITE_STADIA_API_KEY}`,
			center,
			zoom,
			pitch: 0,
			bearing,
			// Remove default controls — you'll add your own HUD
			attributionControl: false,
		})

		mapRef.current.once("load", () => setStyleLoaded(true))
		setMap(mapRef.current)

		return () => {
			const mapToRemove = mapRef.current
			mapRef.current = null
			setMap(null)
			setStyleLoaded(false)
			window.setTimeout(() => {
				mapToRemove?.remove()
			}, 0)
		}
	}, [])

	// Fly to center if it changes after mount rather than remounting.
	// Skip if the map is already at (approximately) the requested position —
	// this prevents Apollo cache round-trips from kicking off a flyTo mid-interaction.
	// useEffect(() => {
	// 	if (!mapRef.current) return
	// 	const c = mapRef.current.getCenter()
	// 	if (
	// 		Math.abs(center[0] - c.lng) < 1e-5 &&
	// 		Math.abs(center[1] - c.lat) < 1e-5 &&
	// 		Math.abs(zoom - mapRef.current.getZoom()) < 0.001 &&
	// 		Math.abs(bearing - mapRef.current.getBearing()) < 0.001
	// 	)
	// 		return
	// 	mapRef.current.flyTo({ center, zoom, bearing, duration: 600 })
	// }, [center, zoom, bearing])

	return (
		<MapProvider value={map}>
			<div ref={containerRef} style={{ width: "100%", height: "100%" }} />
			{map && styleLoaded && children}
		</MapProvider>
	)
}
