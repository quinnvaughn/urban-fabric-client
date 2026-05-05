import { describe, expect, it } from "vitest"
import { makeDrawableSegmentsFromWaypoints, makeWavySegment } from "./wavy-line"

describe("wavy line helpers", () => {
	it("keeps the exact segment endpoints", () => {
		const start: [number, number] = [-118.5, 34]
		const end: [number, number] = [-118.49, 34]
		const segment = makeWavySegment(start, end)

		expect(segment.length).toBeGreaterThan(2)
		expect(segment[0]).toEqual(start)
		expect(segment[segment.length - 1]).toEqual(end)
	})

	it("returns straight drawable segments by default", () => {
		const waypoints: [number, number][] = [
			[-118.5, 34],
			[-118.49, 34],
			[-118.48, 34],
		]

		expect(makeDrawableSegmentsFromWaypoints(waypoints)).toEqual([
			[waypoints[0], waypoints[1]],
			[waypoints[1], waypoints[2]],
		])
	})

	it("expands wavy drawable segments into generated geometry", () => {
		const waypoints: [number, number][] = [
			[-118.5, 34],
			[-118.49, 34],
		]

		const [segment] = makeDrawableSegmentsFromWaypoints(waypoints, "wavy")

		expect(segment.length).toBeGreaterThan(2)
		expect(segment[0]).toEqual(waypoints[0])
		expect(segment[segment.length - 1]).toEqual(waypoints[1])
	})
})
