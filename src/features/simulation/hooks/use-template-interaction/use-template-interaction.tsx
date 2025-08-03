import { useEffect, useRef } from "react"
import { useSimulationMapContext } from "../../../../context"
import { useMapboxContext } from "../../../ui"

type FeatureKey = {
	source: string
	sourceLayer?: string
	id: string | number
}

type FeatureFilter = {
	includeClasses?: string[] | null
	excludeClasses?: string[] | null
}

function passesTemplateFilter(
	feature: mapboxgl.MapboxGeoJSONFeature,
	filter?: FeatureFilter | null,
) {
	const raw = feature.properties?.class
	if (!raw) return false
	const cls = String(raw).toLowerCase()
	const include = filter?.includeClasses?.map((c) => c.toLowerCase())
	const exclude = filter?.excludeClasses?.map((c) => c.toLowerCase())
	if (exclude?.includes(cls)) return false
	if (include?.includes(cls)) return false
	return true
}

export function useTemplateInteraction() {
	const map = useMapboxContext()
	const { selectedTemplate } = useSimulationMapContext()

	const previousHover = useRef<FeatureKey | null>(null)
	const previousActive = useRef<FeatureKey | null>(null)

	useEffect(() => {
		if (!map) return

		if (!selectedTemplate) {
			map.getCanvas().style.cursor = "default"
			return
		}

		const { interactionConfig } = selectedTemplate
		const validLayers: string[] = interactionConfig.validTargetLayers || []
		const hoverLayerId = `template-${selectedTemplate.id}-hover`
		const activeLayerId = `template-${selectedTemplate.id}-active`
		const {
			hoverStyle = {},
			activeStyle = {},
			featureFilter,
		} = interactionConfig as any

		// ---------- helpers --------------------------------------------------
		function ensureStateLayer(
			layerId: string,
			styleConfig: any,
			stateKey: "hover" | "active",
		) {
			const defaultColor = stateKey === "hover" ? "#0af" : "#07a"
			const lineColor = styleConfig?.["line-color"] || defaultColor
			const lineWidth =
				styleConfig?.["line-width"] ?? (stateKey === "hover" ? 6 : 8)

			const paint: Record<string, any> = {
				"line-color": [
					"case",
					["boolean", ["feature-state", stateKey], false],
					lineColor,
					"rgba(0,0,0,0)",
				],
				"line-width": [
					"case",
					["boolean", ["feature-state", stateKey], false],
					lineWidth,
					0,
				],
				"line-opacity": 0.9,
			}

			if (!map.getLayer(layerId)) {
				// Add on TOP (no second argument) so it isn’t hidden by roads-fill
				map.addLayer({
					id: layerId,
					type: "line",
					source: "mapbox",
					"source-layer": "road",
					layout: { "line-join": "round", "line-cap": "round" },
					paint,
				})
			} else {
				map.setPaintProperty(layerId, "line-color", paint["line-color"])
				map.setPaintProperty(layerId, "line-width", paint["line-width"])
				map.setPaintProperty(layerId, "line-opacity", paint["line-opacity"])
			}
		}

		function safeQuery(point: mapboxgl.PointLike) {
			const available = validLayers.filter((id) => !!map.getLayer(id))
			if (available.length === 0) {
				return []
			}
			return map.queryRenderedFeatures(point, {
				layers: available,
			})
		}

		// ---------- runtime setup -------------------------------------------
		function setup() {
			map.getCanvas().style.cursor =
				interactionConfig.defaultCursor || "default"

			ensureStateLayer(hoverLayerId, hoverStyle, "hover")
			ensureStateLayer(activeLayerId, activeStyle, "active")

			function onMouseMove(e: mapboxgl.MapMouseEvent) {
				const feature =
					safeQuery(e.point).find((f) =>
						passesTemplateFilter(f, featureFilter),
					) || null

				map.getCanvas().style.cursor = feature
					? interactionConfig.validCursor || "pointer"
					: interactionConfig.invalidCursor || "not-allowed"

				if (feature && feature.id != null) {
					const key: FeatureKey = {
						source: feature.source,
						sourceLayer:
							(feature.layer as any)?.["source-layer"] ??
							(feature.layer as any)?.sourceLayer ??
							"road",
						id: feature.id as string | number,
					}

					if (
						!previousHover.current ||
						previousHover.current.id !== key.id ||
						previousHover.current.source !== key.source ||
						previousHover.current.sourceLayer !== key.sourceLayer
					) {
						if (previousHover.current) {
							map.setFeatureState(previousHover.current, { hover: false })
						}
						map.setFeatureState(key, { hover: true })
						previousHover.current = key
					}
				} else {
					if (previousHover.current) {
						map.setFeatureState(previousHover.current, { hover: false })
						previousHover.current = null
					}
				}
			}

			function onClick(e: mapboxgl.MapMouseEvent) {
				const feature =
					safeQuery(e.point).find((f) =>
						passesTemplateFilter(f, featureFilter),
					) || null
				if (!feature || feature.id == null) {
					return
				}

				const key: FeatureKey = {
					source: feature.source,
					sourceLayer:
						(feature.layer as any)?.["source-layer"] ??
						(feature.layer as any)?.sourceLayer ??
						"road",
					id: feature.id as string | number,
				}

				if (
					!previousActive.current ||
					previousActive.current.id !== key.id ||
					previousActive.current.source !== key.source ||
					previousActive.current.sourceLayer !== key.sourceLayer
				) {
					if (previousActive.current) {
						map.setFeatureState(previousActive.current, { active: false })
					}
					map.setFeatureState(key, { active: true })
					previousActive.current = key
				}
			}

			map.on("mousemove", onMouseMove)
			map.on("click", onClick)

			return () => {
				map.off("mousemove", onMouseMove)
				map.off("click", onClick)
			}
		}

		let cleanup: (() => void) | void

		return () => {
			if (cleanup) cleanup()
		}
	}, [map, selectedTemplate])

	return null
}
