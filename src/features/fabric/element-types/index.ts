import { BIKING_CATEGORY } from "./biking"
import { INTERSECTIONS_CATEGORY } from "./intersections"
import { STREETS_CATEGORY } from "./streets"
import { TRAILS_AND_PATHS_CATEGORY } from "./trails-and-paths"
import { TRANSIT_CATEGORY } from "./transit"
import type {
	AreaLayerStyle,
	ElementCategory,
	ElementDescriptor,
	ElementInstance,
	FillPaint,
	LineLayerStyle,
	LinePaint,
	PointLayerStyle,
} from "./types"
import { WALKING_CATEGORY } from "./walking"

export type { FillPaint, LinePaint }

export function isLineStyle(
	style: ElementDescriptor["baseMapStyle"],
): style is LineLayerStyle {
	return "width" in style
}

export function isAreaStyle(
	style: ElementDescriptor["baseMapStyle"],
): style is AreaLayerStyle {
	return !isLineStyle(style) && !isPointStyle(style)
}

export function isPointStyle(
	style: ElementDescriptor["baseMapStyle"],
): style is PointLayerStyle {
	return !("width" in style) && !("opacity" in style)
}

function sortElementsAlphabetically(
	category: ElementCategory,
): ElementCategory {
	return {
		...category,
		elements: [...category.elements].sort((a, b) =>
			a.title.localeCompare(b.title),
		),
	}
}

export function computeBasePaint(
	descriptor: ElementDescriptor,
	instance: ElementInstance,
): LinePaint {
	const s = descriptor.baseMapStyle
	if (!isLineStyle(s)) return {}

	const paint: LinePaint = {
		"line-color": s.color,
		"line-width": s.width,
		"line-opacity": s.opacity ?? 1,
		"line-casing-opacity": s.casingOpacity ?? 0.15,
	}

	if (s.dasharray) paint["line-dasharray"] = s.dasharray

	for (const prop of descriptor.properties) {
		const value = instance.properties[prop.key] ?? prop.default
		Object.assign(paint, prop.toMapStyle(value))
	}

	return paint
}

export function computeBaseFillPaint(
	descriptor: ElementDescriptor,
	_instance: ElementInstance,
): FillPaint {
	const s = descriptor.baseMapStyle
	if (!isAreaStyle(s)) return {}

	const paint: FillPaint = {
		"fill-color": s.color,
		"fill-opacity": s.opacity ?? 0.72,
		"fill-outline-color": s.outlineColor ?? s.color,
		"line-color": s.outlineColor ?? s.color,
		"line-width": s.outlineWidth ?? 2,
		"line-opacity": s.outlineOpacity ?? 0.95,
	}

	return paint
}

export const ELEMENT_CATEGORIES: ElementCategory[] = [
	WALKING_CATEGORY,
	INTERSECTIONS_CATEGORY,
	TRAILS_AND_PATHS_CATEGORY,
	BIKING_CATEGORY,
	TRANSIT_CATEGORY,
	STREETS_CATEGORY,
].map(sortElementsAlphabetically)

// Flat lookup by id for when you have a typeId and need the descriptor
export const ELEMENT_TYPE_MAP: Record<string, ElementDescriptor> =
	Object.fromEntries(
		ELEMENT_CATEGORIES.flatMap((c) => c.elements).map((e) => [e.id, e]),
	)
