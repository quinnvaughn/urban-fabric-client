import type maplibregl from "maplibre-gl"

type CaptureOptions = {
	expectedLayerIds?: string[]
	layerTimeoutMs?: number
}

const BLANK_SAMPLE_SIZE = 16
const BLANK_ALPHA_THRESHOLD = 8
const BLANK_COLOR_RANGE_THRESHOLD = 8

export function getCanvasBlob(
	canvas: HTMLCanvasElement,
	type = "image/webp",
): Promise<Blob | null> {
	return new Promise((resolve) => {
		canvas.toBlob(resolve, type)
	})
}

function hasVisibleCanvasContent(canvas: HTMLCanvasElement) {
	if (canvas.width === 0 || canvas.height === 0) return false

	const sample = document.createElement("canvas")
	sample.width = BLANK_SAMPLE_SIZE
	sample.height = BLANK_SAMPLE_SIZE

	const context = sample.getContext("2d", { willReadFrequently: true })
	if (!context) return false

	context.drawImage(canvas, 0, 0, BLANK_SAMPLE_SIZE, BLANK_SAMPLE_SIZE)
	const { data } = context.getImageData(
		0,
		0,
		BLANK_SAMPLE_SIZE,
		BLANK_SAMPLE_SIZE,
	)

	let visiblePixels = 0
	let minR = 255
	let minG = 255
	let minB = 255
	let maxR = 0
	let maxG = 0
	let maxB = 0

	for (let i = 0; i < data.length; i += 4) {
		const alpha = data[i + 3]
		if (alpha <= BLANK_ALPHA_THRESHOLD) continue

		visiblePixels += 1
		const red = data[i]
		const green = data[i + 1]
		const blue = data[i + 2]

		minR = Math.min(minR, red)
		minG = Math.min(minG, green)
		minB = Math.min(minB, blue)
		maxR = Math.max(maxR, red)
		maxG = Math.max(maxG, green)
		maxB = Math.max(maxB, blue)
	}

	if (visiblePixels === 0) return false

	const colorRange = maxR - minR + (maxG - minG) + (maxB - minB)
	return colorRange > BLANK_COLOR_RANGE_THRESHOLD
}

function waitForSettledMap(map: maplibregl.Map, timeoutMs = 2500) {
	if (map.loaded() && !map.isMoving()) return Promise.resolve()

	return new Promise<void>((resolve) => {
		let settled = false
		const timeout = window.setTimeout(finish, timeoutMs)

		function finish() {
			if (settled) return
			settled = true
			window.clearTimeout(timeout)
			map.off("idle", finish)
			resolve()
		}

		map.once("idle", finish)
	})
}

async function waitForLayers(
	map: maplibregl.Map,
	layerIds: string[],
	timeoutMs: number,
) {
	if (layerIds.length === 0) return
	if (layerIds.every((id) => map.getLayer(id))) return

	await new Promise<void>((resolve, reject) => {
		let settled = false
		const timeout = window.setTimeout(() => {
			finish()
			reject(new Error("Map element layers did not render before capture"))
		}, timeoutMs)

		function hasLayers() {
			return layerIds.every((id) => map.getLayer(id))
		}

		function finish() {
			if (settled) return
			settled = true
			window.clearTimeout(timeout)
			map.off("render", check)
			map.off("idle", check)
		}

		function check() {
			if (!hasLayers()) return
			finish()
			resolve()
		}

		map.on("render", check)
		map.on("idle", check)
		map.triggerRepaint()
		check()
	})
}

export async function captureMapCanvasBlob(
	map: maplibregl.Map,
	type = "image/webp",
	options: CaptureOptions = {},
): Promise<Blob | null> {
	await waitForSettledMap(map)
	await waitForLayers(
		map,
		options.expectedLayerIds ?? [],
		options.layerTimeoutMs ?? 3000,
	)

	return new Promise((resolve) => {
		map.once("render", async () => {
			const canvas = map.getCanvas()
			if (!hasVisibleCanvasContent(canvas)) {
				resolve(null)
				return
			}

			resolve(await getCanvasBlob(canvas, type))
		})
		map.triggerRepaint()
	})
}
