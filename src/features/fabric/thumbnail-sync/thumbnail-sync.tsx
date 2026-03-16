import { useCallback, useEffect, useRef } from "react"
import { useMap } from "../fabric-map"
import { useFabricStore } from "../fabric-store"

const VIEWPORT_EVENTS = ["moveend", "zoomend", "rotateend"] as const
const VIEWPORT_DEBOUNCE_MS = 600

type Props = {
	onThumbnail: (thumbnail: string) => Promise<void>
}

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

export function ThumbnailSync({ onThumbnail }: Props) {
	const map = useMap()
	const saveStatus = useFabricStore((s) => s.saveStatus)
	const prevSaveStatus = useRef(saveStatus)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const captureAndSync = useCallback(() => {
		map.once("render", async () => {
			const thumbnail = await getCanvasBase64(map.getCanvas())
			await onThumbnail(thumbnail)
		})
		map.triggerRepaint()
	}, [map, onThumbnail])

	// Capture on element save
	useEffect(() => {
		const wasJustSaved =
			prevSaveStatus.current === "saving" && saveStatus === "saved"
		prevSaveStatus.current = saveStatus

		if (!wasJustSaved) return

		captureAndSync()
	}, [saveStatus, captureAndSync])

	// Capture on viewport change
	useEffect(() => {
		function handleViewportChange() {
			if (timerRef.current) clearTimeout(timerRef.current)
			timerRef.current = setTimeout(captureAndSync, VIEWPORT_DEBOUNCE_MS)
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
	}, [map, captureAndSync])

	return null
}
