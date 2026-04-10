import type maplibregl from "maplibre-gl"
import { ELEMENT_CATEGORIES } from "../element-types"

// Keyed by typeId only — one registered image per element type.
export function lineSymbolImageId(typeId: string) {
	return `urban-fabric-symbol-${typeId}`
}

async function loadSvgMapIcon(
	map: maplibregl.Map,
	id: string,
	src: string,
	color: string,
	size: number,
): Promise<void> {
	if (map.hasImage(id)) return

	// Fetch SVG as text so we can substitute currentColor before rendering.
	let svgText: string
	try {
		const res = await fetch(src)
		if (!res.ok) throw new Error(`${res.status}`)
		svgText = await res.text()
	} catch (e) {
		console.warn(`[urban-fabric] Failed to load map icon: ${src}`, e)
		return
	}

	const colored = svgText.replaceAll("currentColor", color)
	const blob = new Blob([colored], { type: "image/svg+xml" })
	const url = URL.createObjectURL(blob)

	const img = new Image()
	img.src = url
	await new Promise<void>((resolve) => {
		img.onload = () => resolve()
		img.onerror = () => {
			console.warn(`[urban-fabric] Failed to render map icon: ${src}`)
			resolve()
		}
	})
	URL.revokeObjectURL(url)

	if (!img.complete || img.naturalWidth === 0) return

	const canvas = document.createElement("canvas")
	canvas.width = size
	canvas.height = size
	const ctx = canvas.getContext("2d")
	if (!ctx) return
	ctx.drawImage(img, 0, 0, size, size)

	const data = ctx.getImageData(0, 0, size, size)
	map.addImage(id, {
		width: size,
		height: size,
		data: new Uint8Array(data.data.buffer),
	})
}

// Call once during map initialization (before children mount) to pre-register
// all SVG icons declared in element descriptors via lineSymbol.src.
// SVGs should use currentColor for all strokes/fills — the element's base
// color is substituted at load time.
export async function preloadLineSymbolIcons(map: maplibregl.Map): Promise<void> {
	const jobs: Promise<void>[] = []

	for (const category of ELEMENT_CATEGORIES) {
		for (const descriptor of category.elements) {
			const { lineSymbol } = descriptor.baseMapStyle
			if (!lineSymbol) continue
			jobs.push(
				loadSvgMapIcon(
					map,
					lineSymbolImageId(descriptor.id),
					lineSymbol.src,
					descriptor.baseMapStyle.color,
					lineSymbol.size ?? 32,
				),
			)
		}
	}

	await Promise.all(jobs)
}
