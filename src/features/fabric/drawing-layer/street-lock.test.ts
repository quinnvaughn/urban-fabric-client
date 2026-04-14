import { describe, expect, it } from "vitest"
import {
	bearingBetween,
	clampPointToDistance,
	isLikelyRoadFeature,
	offsetPointAlongBearing,
	perpendicularBearing,
	projectPointOntoBearing,
	signedDistanceAlongBearing,
	suggestedCrossingMaxLengthFeet,
} from "./street-lock"

describe("street-lock helpers", () => {
	it("projects a point onto a north-south bearing", () => {
		expect(
			projectPointOntoBearing(
				[-122.42, 37.77],
				[-122.4198, 37.7702],
				0,
			)[0],
		).toBeCloseTo(-122.42, 6)
	})

	it("computes a perpendicular bearing", () => {
		expect(perpendicularBearing(45)).toBe(135)
	})

	it("computes a local bearing", () => {
		expect(bearingBetween([-122.42, 37.77], [-122.4199, 37.77])).toBeCloseTo(90, 0)
	})

	it("clamps a point to a max distance", () => {
		const clamped = clampPointToDistance(
			[-122.42, 37.77],
			[-122.419, 37.77],
			80,
		)
		expect(bearingBetween([-122.42, 37.77], clamped)).toBeCloseTo(90, 0)
		expect(clamped[0]).toBeLessThan(-122.419)
	})

	it("offsets and measures distance along a bearing", () => {
		const center: [number, number] = [-122.42, 37.77]
		const target = offsetPointAlongBearing(center, 90, 40)
		expect(signedDistanceAlongBearing(center, target, 90)).toBeGreaterThan(10)
	})

	it("accepts likely road line features", () => {
		expect(
			isLikelyRoadFeature({
				layer: { id: "transportation", type: "line" },
				geometry: { type: "LineString", coordinates: [] },
			} as never),
		).toBe(true)
	})

	it("rejects editor and pedestrian path features", () => {
		expect(
			isLikelyRoadFeature({
				layer: { id: "draw-active", type: "line" },
				geometry: { type: "LineString", coordinates: [] },
			} as never),
		).toBe(false)
		expect(
			isLikelyRoadFeature({
				layer: { id: "pedestrian_path", type: "line" },
				geometry: { type: "LineString", coordinates: [] },
			} as never),
		).toBe(false)
	})

	it("suggests a larger max length for bigger roads", () => {
		expect(
			suggestedCrossingMaxLengthFeet({
				properties: { class: "primary" },
			} as never),
		).toBe(110)
		expect(
			suggestedCrossingMaxLengthFeet({
				properties: { highway: "motorway" },
			} as never),
		).toBe(160)
		expect(
			suggestedCrossingMaxLengthFeet({
				properties: { class: "residential" },
			} as never),
		).toBe(60)
	})
})
