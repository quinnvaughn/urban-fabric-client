import { useEffect, useRef } from "react"
import { useMap } from "../fabric-map"

type Props = {
	onViewportChange: (viewport: {
		center: { lng: number; lat: number }
		zoom: number
		bearing: number
		thumbnail: string
	}) => Promise<void>
}

const VIEWPORT_EVENTS = ["moveend", "zoomend", "rotateend"] as const

function getCanvasBase64(canvas: HTMLCanvasElement): Promise<string> {
	return new Promise((resolve) => {
		canvas.toBlob((blob) => {
			if (!blob) return resolve("")
			const reader = new FileReader()
			reader.onloadend = () => resolve(reader.result as string)
			reader.readAsDataURL(blob)
		}, "image/png")
	})
}

export function ViewportTracker({ onViewportChange }: Props) {
	const map = useMap()
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		function handleViewportChange() {
			if (timerRef.current) clearTimeout(timerRef.current)
			timerRef.current = setTimeout(() => {
				const { lng, lat } = map.getCenter()
				const zoom = map.getZoom()
				const bearing = map.getBearing()

				map.once("render", async () => {
					const thumbnail = await getCanvasBase64(map.getCanvas())
					onViewportChange({
						center: { lng, lat },
						zoom,
						bearing,
						thumbnail,
					})
				})

				// trigger a render if the map is idle
				map.triggerRepaint()
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
