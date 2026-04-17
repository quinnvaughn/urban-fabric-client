import type maplibregl from "maplibre-gl"
import { captureMapCanvasBlob } from "#/features/fabric/thumbnail-sync"

const WATERMARK_SRC = "/watermark.png"
const WATERMARK_MAX_WIDTH_RATIO = 0.26
const WATERMARK_MARGIN_RATIO = 0.025

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.onload = () => resolve(image)
		image.onerror = () => reject(new Error(`Unable to load ${src}`))
		image.src = src
	})
}

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob)
	const anchor = document.createElement("a")
	anchor.href = url
	anchor.download = filename
	document.body.append(anchor)
	anchor.click()
	anchor.remove()
	window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

function filenameForTitle(title: string) {
	const slug = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80)

	return `${slug || "proposal-map"}-urban-fabric.png`
}

async function addWatermark(mapBlob: Blob): Promise<Blob | null> {
	const mapUrl = URL.createObjectURL(mapBlob)
	try {
		const [mapImage, watermark] = await Promise.all([
			loadImage(mapUrl),
			loadImage(WATERMARK_SRC),
		])

		const canvas = document.createElement("canvas")
		canvas.width = mapImage.naturalWidth
		canvas.height = mapImage.naturalHeight

		const context = canvas.getContext("2d")
		if (!context) return null

		context.drawImage(mapImage, 0, 0)

		const maxWatermarkWidth = canvas.width * WATERMARK_MAX_WIDTH_RATIO
		const watermarkWidth = Math.min(watermark.naturalWidth, maxWatermarkWidth)
		const watermarkHeight =
			(watermark.naturalHeight / watermark.naturalWidth) * watermarkWidth
		const margin = Math.max(16, canvas.width * WATERMARK_MARGIN_RATIO)

		context.drawImage(
			watermark,
			canvas.width - watermarkWidth - margin,
			canvas.height - watermarkHeight - margin,
			watermarkWidth,
			watermarkHeight,
		)

		return new Promise((resolve) => {
			canvas.toBlob(resolve, "image/png")
		})
	} finally {
		URL.revokeObjectURL(mapUrl)
	}
}

export async function downloadProposalMapImage({
	map,
	title,
}: {
	map: maplibregl.Map
	title: string
}) {
	const mapBlob = await captureMapCanvasBlob(map, "image/png")
	if (!mapBlob) throw new Error("Unable to capture map image")

	const watermarkedBlob = await addWatermark(mapBlob)
	if (!watermarkedBlob) throw new Error("Unable to watermark map image")

	downloadBlob(watermarkedBlob, filenameForTitle(title))
}
