import "maplibre-gl/dist/maplibre-gl.css"
import maplibregl from "maplibre-gl"
import { Fragment, useEffect, useRef, useState } from "react"
import { MapStyle } from "#/graphql/generated"
import { getClientEnv } from "#/lib/env/client"
import { preloadLineSymbolIcons } from "../elements-layer/map-icon-loader"
import { MapProvider } from "./map-context"

const STYLE_NAMES: Record<MapStyle, string> = {
	[MapStyle.Default]: "osm_bright",
	[MapStyle.Dark]: "alidade_smooth_dark",
	[MapStyle.Light]: "alidade_smooth",
}

function styleUrl(style: MapStyle) {
	const { VITE_STADIA_API_KEY } = getClientEnv()
	return `https://tiles.stadiamaps.com/styles/${STYLE_NAMES[style]}.json?api_key=${VITE_STADIA_API_KEY}`
}

type Props = {
	center: [number, number] // [lng, lat]
	zoom?: number
	bearing?: number
	mapStyle?: MapStyle
	children?: React.ReactNode
}

export function FabricMap({
	center,
	zoom = 15,
	bearing = 0,
	mapStyle = MapStyle.Default,
	children,
}: Props) {
	const containerRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<maplibregl.Map | null>(null)
	const [map, setMap] = useState<maplibregl.Map | null>(null)
	const [styleLoaded, setStyleLoaded] = useState(false)
	const [styleVersion, setStyleVersion] = useState(0)
	const isMounted = useRef(false)

	// Initialize once — intentionally empty deps
	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore
	useEffect(() => {
		if (!containerRef.current || mapRef.current) return

		mapRef.current = new maplibregl.Map({
			container: containerRef.current,
			style: styleUrl(mapStyle),
			center,
			zoom,
			pitch: 0,
			bearing,
			// Remove default controls — you'll add your own HUD
			attributionControl: false,
		})

		mapRef.current.once("load", async () => {
			if (mapRef.current) await preloadLineSymbolIcons(mapRef.current)
			setStyleLoaded(true)
			setStyleVersion((v) => v + 1)
			isMounted.current = true
		})
		setMap(mapRef.current)

		return () => {
			isMounted.current = false
			const mapToRemove = mapRef.current
			mapRef.current = null
			setMap(null)
			setStyleLoaded(false)
			window.setTimeout(() => {
				mapToRemove?.remove()
			}, 0)
		}
	}, [])

	// Switch style when mapStyle prop changes after initial mount
	useEffect(() => {
		if (!isMounted.current || !mapRef.current) return
		setStyleLoaded(false)
		mapRef.current.setStyle(styleUrl(mapStyle))
		mapRef.current.once("style.load", async () => {
			if (mapRef.current) await preloadLineSymbolIcons(mapRef.current)
			setStyleLoaded(true)
			setStyleVersion((v) => v + 1)
		})
	}, [mapStyle])

	return (
		<MapProvider value={map}>
			<div ref={containerRef} style={{ width: "100%", height: "100%" }} />
			{map && styleLoaded && <Fragment key={styleVersion}>{children}</Fragment>}
		</MapProvider>
	)
}
