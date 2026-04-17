import type maplibregl from "maplibre-gl"

export function getCanvasBlob(
	canvas: HTMLCanvasElement,
	type = "image/webp",
): Promise<Blob | null> {
	return new Promise((resolve) => {
		canvas.toBlob(resolve, type)
	})
}

export function captureMapCanvasBlob(
	map: maplibregl.Map,
	type = "image/webp",
): Promise<Blob | null> {
	return new Promise((resolve) => {
		map.once("render", async () => {
			resolve(await getCanvasBlob(map.getCanvas(), type))
		})
		map.triggerRepaint()
	})
}
