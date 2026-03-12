import { STREETS_CATEGORY } from "./streets"
import type { ElementCategory, ElementDescriptor } from "./types"

// All categories in render order — add INTERSECTIONS_CATEGORY etc here in v2
export const ELEMENT_CATEGORIES: ElementCategory[] = [STREETS_CATEGORY]

// Flat lookup by id for when you have a typeId and need the descriptor
export const ELEMENT_TYPE_MAP: Record<string, ElementDescriptor> =
	Object.fromEntries(
		ELEMENT_CATEGORIES.flatMap((c) => c.elements).map((e) => [e.id, e]),
	)
