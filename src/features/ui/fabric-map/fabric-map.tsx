import mapboxgl, { type LayerSpecification } from "mapbox-gl"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import { css } from "../../../styles/styled-system/css"
import { IconButton } from "../icon-button"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const MapboxContext = createContext<mapboxgl.Map | null>(null)

export function MapboxProvider({
	children,
	map,
}: {
	children: React.ReactNode
	map: mapboxgl.Map
}) {
	return <MapboxContext.Provider value={map}>{children}</MapboxContext.Provider>
}

export function useMapboxContext() {
	const context = useContext(MapboxContext)
	if (!context) {
		throw new Error("useMapboxContext must be used within a MapboxProvider")
	}
	return context
}
export function useOnMapLoad<T>(fn: () => T): T | null {
	const map = useMapboxContext()
	const [result, setResult] = useState<T | null>(null)

	// biome-ignore lint/correctness/useExhaustiveDependencies: `fn` is a dependency but we want to run it only once when the map loads
	useEffect(() => {
		if (!map) return
		setResult(fn())
	}, [map])

	return result
}

export function useMapClick(
	layers: string[] | null | undefined,
	handler: (feature: mapboxgl.GeoJSONFeature) => void,
) {
	const map = useMapboxContext()

	useEffect(() => {
		if (!map || !layers?.length) return

		const clickHandler = (e: mapboxgl.MapMouseEvent) => {
			const features = map.queryRenderedFeatures(e.point, { layers })
			if (features.length > 0) {
				handler(features[0] as mapboxgl.GeoJSONFeature)
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
	source: mapboxgl.SourceSpecification,
) {
	const map = useMapboxContext()
	const addedRef = useRef(false)

	// biome-ignore lint/correctness/useExhaustiveDependencies: `id` and `source` are dependencies but we want to add the source only once
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
	style = "mapbox://styles/mapbox/streets-v11",
	pitch = 0,
	bearing = 0,
}: {
	children?: React.ReactNode
	center?: [number, number]
	zoom?: number
	style?: string
	pitch?: number
	bearing?: number
}) {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [map, setMap] = useState<mapboxgl.Map | null>(null)

	// biome-ignore lint/correctness/useExhaustiveDependencies: `containerRef` is a dependency but we want to set up the map only once
	useEffect(() => {
		if (!containerRef.current) return

		const instance = new mapboxgl.Map({
			container: containerRef.current,
			style,
			center,
			zoom,
			pitch,
			bearing,
			attributionControl: false,
		})
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
			<MapboxProvider map={map}>
				{children}
				<IconButton
					icon="Minus"
					className={css({
						position: "absolute",
						bottom: "16px",
						right: "56px",
						zIndex: 1000,
						borderRadius: "sm",
						_hover: {
							bg: "neutral.400",
						},
					})}
				/>
				<IconButton
					icon="Plus"
					className={css({
						position: "absolute",
						bottom: "16px",
						right: "16px",
						zIndex: 1000,
						borderRadius: "sm",
						_hover: {
							bg: "neutral.400",
						},
					})}
				/>
			</MapboxProvider>
		</div>
	)
}

type Props = LayerSpecification & {
	before?: string
}

FabricMap.Layer = function MapLayer({ before, ...layer }: Props) {
	const map = useMapboxContext()
	const addedRef = useRef(false)

	// biome-ignore lint/correctness/useExhaustiveDependencies: we only want to add the layer once
	useEffect(() => {
		if (!map || map.getLayer(layer.id)) return

		const tryAddLayer = () => {
			if (map.getLayer(layer.id)) return
			map.addLayer(structuredClone(layer), before)
			addedRef.current = true
		}

		if (map.isStyleLoaded()) {
			tryAddLayer()
		} else {
			map.once("style.load", tryAddLayer)
		}

		return () => {
			if (addedRef.current && map.getLayer(layer.id)) {
				map.removeLayer(layer.id)
			}
		}
	}, [map, before, layer.id])

	return null
}
