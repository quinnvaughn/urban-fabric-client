import { lineLengthFeet } from "../element-metrics"
import type { ElementDescriptor } from "../element-types/types"

export type DrawingValidationResult = {
	isValid: boolean
	message?: string
}

function formatFeet(feet: number) {
	return `${Math.round(feet).toLocaleString()} ft`
}

export function validateDrawingConstraints(
	descriptor: ElementDescriptor,
	coordinates: [number, number][],
): DrawingValidationResult {
	const { drawingConstraints } = descriptor
	if (!drawingConstraints) return { isValid: true }

	const lengthFeet = lineLengthFeet(coordinates)
	const { maxLengthFeet } = drawingConstraints

	if (
		typeof maxLengthFeet === "number" &&
		Number.isFinite(maxLengthFeet) &&
		lengthFeet > maxLengthFeet
	) {
		return {
			isValid: false,
			message: `${descriptor.title} must be ${formatFeet(maxLengthFeet)} or shorter.`,
		}
	}

	return { isValid: true }
}
