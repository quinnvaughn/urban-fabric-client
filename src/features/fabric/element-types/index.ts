import { STREETS_CATEGORY } from "./streets"
import type {
	ElementCategory,
	ElementDescriptor,
	ElementInstance,
	LinePaint,
} from "./types"

export type { LinePaint }

export function computeBasePaint(
	descriptor: ElementDescriptor,
	instance: ElementInstance,
): LinePaint {
	const s = descriptor.baseMapStyle

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

// All categories in render order — add INTERSECTIONS_CATEGORY etc here in v2
export const ELEMENT_CATEGORIES: ElementCategory[] = [STREETS_CATEGORY]

// Flat lookup by id for when you have a typeId and need the descriptor
export const ELEMENT_TYPE_MAP: Record<string, ElementDescriptor> =
	Object.fromEntries(
		ELEMENT_CATEGORIES.flatMap((c) => c.elements).map((e) => [e.id, e]),
	)
