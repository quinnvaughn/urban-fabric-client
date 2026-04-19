import type maplibregl from "maplibre-gl"

export function getCanvasBlob(
	canvas: HTMLCanvasElement,
	type = "image/webp",
): Promise<Blob | null> {
	return new Promise((resolve) => {
		canvas.toBlob(resolve, type)
	})
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

export async function captureMapCanvasBlob(
	map: maplibregl.Map,
	type = "image/webp",
): Promise<Blob | null> {
	await waitForSettledMap(map)

	return new Promise((resolve) => {
		map.once("render", async () => {
			resolve(await getCanvasBlob(map.getCanvas(), type))
		})
		map.triggerRepaint()
	})
}
