import { useEffect, useRef } from "react"
import { useMap } from "../fabric-map"

type Viewport = {
	center: { lng: number; lat: number }
	zoom: number
}

type Props = {
	viewport: Viewport
	onViewportChange: (viewport: Viewport) => void
	animationDurationMs?: number
}

const EPS = {
	center: 1e-5,
	zoom: 1e-3,
}

function isSameViewport(a: Viewport, b: Viewport): boolean {
	return (
		Math.abs(a.center.lng - b.center.lng) < EPS.center &&
		Math.abs(a.center.lat - b.center.lat) < EPS.center &&
		Math.abs(a.zoom - b.zoom) < EPS.zoom
	)
}

export function ViewportSync({
	viewport,
	onViewportChange,
	animationDurationMs = 300,
}: Props) {
	const map = useMap()
	const lastReportedRef = useRef<Viewport | null>(null)

	useEffect(() => {
		const current = {
			center: {
				lng: map.getCenter().lng,
				lat: map.getCenter().lat,
			},
			zoom: map.getZoom(),
		}

		if (isSameViewport(current, viewport)) return

		map.easeTo({
			center: [viewport.center.lng, viewport.center.lat],
			zoom: viewport.zoom,
			duration: animationDurationMs,
		})
	}, [map, viewport, animationDurationMs])

	useEffect(() => {
		function emitViewport() {
			const next = {
				center: {
					lng: map.getCenter().lng,
					lat: map.getCenter().lat,
				},
				zoom: map.getZoom(),
			}

			if (
				lastReportedRef.current &&
				isSameViewport(lastReportedRef.current, next)
			) {
				return
			}

			lastReportedRef.current = next
			onViewportChange(next)
		}

		map.on("moveend", emitViewport)
		map.on("zoomend", emitViewport)

		return () => {
			map.off("moveend", emitViewport)
			map.off("zoomend", emitViewport)
		}
	}, [map, onViewportChange])

	return null
}
