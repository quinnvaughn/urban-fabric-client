import { useCallback, useEffect, useRef } from "react"
import { useMap } from "../fabric-map"
import { fabricStore, useFabricStore } from "../fabric-store"

const VIEWPORT_EVENTS = ["moveend", "zoomend", "rotateend"] as const
const VIEWPORT_DEBOUNCE_MS = 600

type Props = {
	onThumbnail: (thumbnail: Blob) => Promise<string>
	onCaptureReady?: (capture: (() => Promise<string>) | null) => void
	captureOnMount?: boolean
}

function getCanvasBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
	return new Promise((resolve) => {
		canvas.toBlob(resolve, "image/webp")
	})
}

export function ThumbnailSync({
	onThumbnail,
	onCaptureReady,
	captureOnMount,
}: Props) {
	const map = useMap()
	const { saveStatus, selectedInstanceId } = useFabricStore()
	const prevSaveStatus = useRef(saveStatus)
	const pendingCapture = useRef(false)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const captureThumbnail = useCallback(
		() =>
			new Promise<string>((resolve) => {
				map.once("render", async () => {
					const thumbnail = await getCanvasBlob(map.getCanvas())
					if (!thumbnail) {
						resolve("")
						return
					}
					const publicUrl = await onThumbnail(thumbnail)
					resolve(publicUrl)
				})
				map.triggerRepaint()
			}),
		[map, onThumbnail],
	)

	const captureAndSync = useCallback(() => {
		void captureThumbnail()
	}, [captureThumbnail])

	useEffect(() => {
		onCaptureReady?.(captureThumbnail)
		return () => onCaptureReady?.(null)
	}, [captureThumbnail, onCaptureReady])

	// On element save, capture immediately if nothing selected, otherwise defer
	useEffect(() => {
		const wasJustSaved =
			prevSaveStatus.current === "saving" && saveStatus === "saved"
		prevSaveStatus.current = saveStatus

		if (!wasJustSaved) return

		if (fabricStore.state.selectedInstanceId === null) {
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

	// Capture once on initial mount (e.g. newly created fabric with no thumbnail)
	useEffect(() => {
		if (!captureOnMount) return
		let cancelled = false
		function onIdle() {
			if (!cancelled) captureAndSync()
		}
		map.once("idle", onIdle)
		return () => {
			cancelled = true
			map.off("idle", onIdle)
		}
	}, [captureOnMount, map, captureAndSync])

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
