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
	const selectedInstanceId = useFabricStore((s) => s.selectedInstanceId)
	const prevSaveStatus = useRef(saveStatus)
	const pendingCapture = useRef(false)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const captureAndSync = useCallback(() => {
		map.once("render", async () => {
			const thumbnail = await getCanvasBase64(map.getCanvas())
			await onThumbnail(thumbnail)
		})
		map.triggerRepaint()
	}, [map, onThumbnail])

	// On element save, capture immediately if nothing selected, otherwise defer
	useEffect(() => {
		const wasJustSaved =
			prevSaveStatus.current === "saving" && saveStatus === "saved"
		prevSaveStatus.current = saveStatus

		if (!wasJustSaved) return

		if (useFabricStore.getState().selectedInstanceId === null) {
			captureAndSync()
		} else {
			pendingCapture.current = true
		}
	}, [saveStatus, captureAndSync])

	// Fire pending capture once selection is cleared.
	// rAF defers by one frame so the map's feature-state update (visual deselection)
	// has time to apply before we capture the canvas.
	useEffect(() => {
		if (selectedInstanceId !== null || !pendingCapture.current) return
		pendingCapture.current = false
		const raf = requestAnimationFrame(() => captureAndSync())
		return () => cancelAnimationFrame(raf)
	}, [selectedInstanceId, captureAndSync])

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
