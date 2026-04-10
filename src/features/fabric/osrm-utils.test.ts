import { describe, expect, it } from "vitest"
import { flattenSegments } from "./osrm-utils"

describe("flattenSegments", () => {
	it("returns empty array for empty input", () => {
		expect(flattenSegments([])).toEqual([])
	})

	it("returns the single segment as-is", () => {
		const seg: [number, number][] = [
			[0, 0],
			[1, 1],
			[2, 2],
		]
		expect(flattenSegments([seg])).toEqual(seg)
	})

	it("joins two segments without duplicating the shared point", () => {
		const a: [number, number][] = [
			[0, 0],
			[1, 1],
		]
		const b: [number, number][] = [
			[1, 1],
			[2, 2],
		]
		expect(flattenSegments([a, b])).toEqual([
			[0, 0],
			[1, 1],
			[2, 2],
		])
	})

	it("joins three segments without duplicating shared points", () => {
		const a: [number, number][] = [
			[0, 0],
			[1, 1],
		]
		const b: [number, number][] = [
			[1, 1],
			[2, 2],
		]
		const c: [number, number][] = [
			[2, 2],
			[3, 3],
		]
		expect(flattenSegments([a, b, c])).toEqual([
			[0, 0],
			[1, 1],
			[2, 2],
			[3, 3],
		])
	})
})
