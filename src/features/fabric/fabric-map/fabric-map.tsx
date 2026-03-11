import maplibregl from "maplibre-gl"
import { useEffect, useRef } from "react"
import "maplibre-gl/dist/maplibre-gl.css"

type Props = {
	center: { lat: number; lng: number }
	zoom?: number
}

export function FabricMap({ center, zoom = 13 }: Props) {
	const containerRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<maplibregl.Map | null>(null)

	useEffect(() => {
		if (!containerRef.current || mapRef.current) return

		mapRef.current = new maplibregl.Map({
			container: containerRef.current,
			style: "https://demotiles.maplibre.org/style.json", // free demo tiles
			center: [center.lng, center.lat],
			zoom,
		})

		return () => {
			mapRef.current?.remove()
			mapRef.current = null
		}
	}, [center, zoom])

	return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
}
