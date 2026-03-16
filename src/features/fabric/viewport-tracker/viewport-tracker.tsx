import { useEffect, useRef } from "react"
import { useMap } from "../fabric-map"

type Props = {
	onViewportChange: (viewport: {
		center: { lng: number; lat: number }
		zoom: number
	}) => Promise<void>
}

const VIEWPORT_EVENTS = ["moveend", "zoomend", "rotateend"] as const

export function ViewportTracker({ onViewportChange }: Props) {
	const map = useMap()
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		function handleViewportChange() {
			if (timerRef.current) clearTimeout(timerRef.current)
			timerRef.current = setTimeout(() => {
				const { lng, lat } = map.getCenter()
				const zoom = map.getZoom()
				onViewportChange({ center: { lng, lat }, zoom })
			}, 600)
		}

		for (const event of VIEWPORT_EVENTS) {
			map.on(event, handleViewportChange)
		}

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current)
			for (const event of VIEWPORT_EVENTS) {
				map.off(event, handleViewportChange)
			}
		}
	}, [map, onViewportChange])

	return null
}
