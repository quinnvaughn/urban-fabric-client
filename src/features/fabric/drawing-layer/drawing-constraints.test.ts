import { describe, expect, it } from "vitest"
import type { ElementDescriptor } from "../element-types/types"
import { validateDrawingConstraints } from "./drawing-constraints"

const descriptor: ElementDescriptor = {
	id: "test-element",
	title: "Test Element",
	geometry: "line",
	draw: "straight-line-points",
	drawingConstraints: {
		maxLengthFeet: 100,
	},
	baseMapStyle: {
		color: "#000000",
		width: 1,
	},
	properties: [],
	calculated: [],
}

describe("validateDrawingConstraints", () => {
	it("returns valid when the descriptor has no drawing constraints", () => {
		expect(
			validateDrawingConstraints(
				{ ...descriptor, drawingConstraints: undefined },
				[
					[-122.42, 37.77],
					[-122.41995, 37.77],
				],
			),
		).toEqual({ isValid: true })
	})

	it("returns valid when the line is within the max length", () => {
		expect(
			validateDrawingConstraints(descriptor, [
				[-122.42, 37.77],
				[-122.4198, 37.77],
			]).isValid,
		).toBe(true)
	})

	it("returns an error when the line exceeds the max length", () => {
		expect(
			validateDrawingConstraints(descriptor, [
				[-122.42, 37.77],
				[-122.419, 37.77],
			]),
		).toEqual({
			isValid: false,
			message: "Test Element must be 100 ft or shorter.",
		})
	})
})
