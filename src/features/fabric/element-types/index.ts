import { BIKING_CATEGORY } from "./biking"
import { STREETS_CATEGORY } from "./streets"
import { TRANSIT_CATEGORY } from "./transit"
import { WALKING_CATEGORY } from "./walking"
import type {
	ElementCategory,
	ElementDescriptor,
	ElementInstance,
	LinePaint,
} from "./types"

export type { LinePaint }

function sortElementsAlphabetically(category: ElementCategory): ElementCategory {
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

export const ELEMENT_CATEGORIES: ElementCategory[] = [
	WALKING_CATEGORY,
	BIKING_CATEGORY,
	TRANSIT_CATEGORY,
	STREETS_CATEGORY,
].map(sortElementsAlphabetically)

// Flat lookup by id for when you have a typeId and need the descriptor
export const ELEMENT_TYPE_MAP: Record<string, ElementDescriptor> =
	Object.fromEntries(
		ELEMENT_CATEGORIES.flatMap((c) => c.elements).map((e) => [e.id, e]),
	)
