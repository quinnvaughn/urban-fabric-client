import maplibre, { type LayerSpecification } from "maplibre-gl"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import "maplibre-gl/dist/maplibre-gl.css"
import { css } from "../../../styles/styled-system/css"
import { makeCanvasStyle } from "./canvas"

const MapContext = createContext<maplibre.Map | null>(null)

export function MapProvider({
	children,
	map,
}: {
	children: React.ReactNode
	map: maplibre.Map
}) {
	return <MapContext.Provider value={map}>{children}</MapContext.Provider>
}

export function useMapContext() {
	const context = useContext(MapContext)
	if (!context) {
		throw new Error("useMapContext must be used within a MapProvider")
	}
	return context
}
export function useOnMapLoad<T>(fn: () => T): T | null {
	const map = useMapContext()
	const [result, setResult] = useState<T | null>(null)
	useEffect(() => {
		if (!map) return
		setResult(fn())
	}, [map])

	return result
}

export function useMapClick(
	layers: string[] | null | undefined,
	handler: (feature: maplibre.GeoJSONFeature) => void,
) {
	const map = useMapContext()

	useEffect(() => {
		if (!map || !layers?.length) return

		const clickHandler = (e: maplibre.MapMouseEvent) => {
			const features = map.queryRenderedFeatures(e.point, { layers })
			if (features.length > 0) {
				handler(features[0] as maplibre.GeoJSONFeature)
			}
		}

		map.on("click", clickHandler)
		return () => {
			map.off("click", clickHandler)
		}
	}, [map, layers, handler])
}

export function useAddSourceOnce(
	id: string,
	source: maplibre.SourceSpecification,
) {
	const map = useMapContext()
	const addedRef = useRef(false)

	useEffect(() => {
		if (!map || addedRef.current || map.getSource(id)) return
		map.addSource(id, source)
		addedRef.current = true
	}, [map])
}

export function FabricMap({
	children,
	center = [-118.2437, 34.0522], // default Los Angeles coordinates
	// these are not right. Invalid LngLat latitude value: must be between -90 and 90
	zoom = 12,
	pitch = 30,
	bearing = 0,
}: {
	children?: React.ReactNode
	center?: [number, number]
	zoom?: number
	pitch?: number
	bearing?: number
}) {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [map, setMap] = useState<maplibre.Map | null>(null)

	useEffect(() => {
		if (!containerRef.current) return

		const instance = new maplibre.Map({
			container: containerRef.current,
			style: makeCanvasStyle(import.meta.env.VITE_TILES_URL, {
				dev: true,
			}),
			center,
			zoom,
			pitch,
			bearing,
			attributionControl: false,
		})
		instance.scrollZoom.setWheelZoomRate(1.5)
		setMap(instance)

		return () => instance.remove()
	}, [])

	if (!map)
		return (
			<div
				ref={containerRef}
				className={css({ width: "100%", height: "100%" })}
			/>
		)

	return (
		<div ref={containerRef} className={css({ width: "100%", height: "100%" })}>
			<MapProvider map={map}>{children}</MapProvider>
		</div>
	)
}

type Props = LayerSpecification & {
	before?: string
}

FabricMap.Layer = function MapLayer({ before, ...layer }: Props) {
	const map = useMapContext()
	const addedRef = useRef(false)

	useEffect(() => {
		if (!map || map.getLayer(layer.id)) return

		let scheduled = false
		const tryAddLayer = () => {
			if (!map.getLayer(layer.id)) {
				map.addLayer(structuredClone(layer), before)
				addedRef.current = true
			}
		}

		if (map.isStyleLoaded()) {
			tryAddLayer()
		} else {
			map.once("style.load", tryAddLayer)
			scheduled = true
		}

		return () => {
			if (scheduled) {
				map.off("style.load", tryAddLayer)
			}
		}
	}, [map, before, layer.id])

	return null
}
