import { describe, expect, it } from "vitest"
import { computeBasePaint, ELEMENT_CATEGORIES, ELEMENT_TYPE_MAP } from "."
import type { ElementInstance } from "./types"

// Valid top-level paint keys that computeBasePaint is allowed to produce
const VALID_LINE_PAINT_KEYS = new Set([
	"line-color",
	"line-width",
	"line-opacity",
	"line-dasharray",
	"line-casing-opacity",
])

// ── Element registry ──────────────────────────────────────────────────────────

describe("ELEMENT_CATEGORIES", () => {
	it("has at least one category", () => {
		expect(ELEMENT_CATEGORIES.length).toBeGreaterThan(0)
	})

	it("all element IDs are unique across categories", () => {
		const ids = ELEMENT_CATEGORIES.flatMap((c) => c.elements.map((e) => e.id))
		expect(ids.length).toBe(new Set(ids).size)
	})

	it("orders elements alphabetically by title within each category", () => {
		for (const category of ELEMENT_CATEGORIES) {
			const titles = category.elements.map((element) => element.title)
			const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b))
			expect(titles, `${category.id} elements should be alphabetized`).toEqual(
				sortedTitles,
			)
		}
	})

	it("every element has required fields", () => {
		for (const category of ELEMENT_CATEGORIES) {
			for (const el of category.elements) {
				expect(el.id, `${el.id}: missing id`).toBeTruthy()
				expect(el.title, `${el.id}: missing title`).toBeTruthy()
				expect(el.geometry, `${el.id}: missing geometry`).toBe("line")
				expect(
					[
						"click-to-place-points",
						"straight-line-points",
						"single-segment-perpendicular",
					],
					`${el.id}: unknown draw mode`,
				).toContain(el.draw)
				expect(el.baseMapStyle, `${el.id}: missing baseMapStyle`).toBeTruthy()
				expect(
					el.baseMapStyle.color,
					`${el.id}: missing baseMapStyle.color`,
				).toBeTruthy()
			}
		}
	})

	it("ELEMENT_TYPE_MAP contains every element", () => {
		for (const category of ELEMENT_CATEGORIES) {
			for (const el of category.elements) {
				expect(ELEMENT_TYPE_MAP[el.id], `${el.id} missing from type map`).toBe(
					el,
				)
			}
		}
	})

	it("keeps shared-use paths independent of road routing", () => {
		const category = ELEMENT_CATEGORIES.find((c) => c.id === "trails-and-paths")
		const descriptor = ELEMENT_TYPE_MAP["shared-use-path"]

		expect(category?.title).toBe("Trails & Paths")
		expect(category?.elements).toContain(descriptor)
		expect(descriptor.title).toBe("Shared-Use Path")
		expect(descriptor.draw).toBe("straight-line-points")
		expect(descriptor.drawingConstraints).toBeUndefined()
	})

	it("every property has a toMapStyle function", () => {
		for (const category of ELEMENT_CATEGORIES) {
			for (const el of category.elements) {
				for (const prop of el.properties) {
					expect(
						typeof prop.toMapStyle,
						`${el.id}.${prop.key}: toMapStyle must be a function`,
					).toBe("function")
				}
			}
		}
	})
})

// ── computeBasePaint ──────────────────────────────────────────────────────────

describe("computeBasePaint", () => {
	it("only returns valid line paint keys for every element at default properties", () => {
		for (const category of ELEMENT_CATEGORIES) {
			for (const descriptor of category.elements) {
				const instance: ElementInstance = {
					id: "test",
					typeId: descriptor.id,
					geometry: "line",
					coordinates: [],
					waypoints: [],
					properties: Object.fromEntries(
						descriptor.properties.map((p) => [p.key, p.default]),
					),
				}
				const paint = computeBasePaint(descriptor, instance)
				for (const key of Object.keys(paint)) {
					expect(
						VALID_LINE_PAINT_KEYS.has(key),
						`${descriptor.id}: computeBasePaint produced unknown key "${key}"`,
					).toBe(true)
				}
			}
		}
	})

	it("includes baseMapStyle color in output", () => {
		// Use sharrow — it has no properties that override color
		const descriptor = ELEMENT_TYPE_MAP.sharrow
		const instance: ElementInstance = {
			id: "test",
			typeId: "sharrow",
			geometry: "line",
			coordinates: [],
			waypoints: [],
			properties: {},
		}
		const paint = computeBasePaint(descriptor, instance)
		expect(paint["line-color"]).toBe(descriptor.baseMapStyle.color)
		expect(paint["line-width"]).toBe(descriptor.baseMapStyle.width)
	})

	it("property toMapStyle overrides baseMapStyle values", () => {
		// bike-lane has a paint property that changes line-color
		const descriptor = ELEMENT_TYPE_MAP["bike-lane"]
		const instance: ElementInstance = {
			id: "test",
			typeId: "bike-lane",
			geometry: "line",
			coordinates: [],
			waypoints: [],
			properties: { paint: "red" },
		}
		const paint = computeBasePaint(descriptor, instance)
		expect(paint["line-color"]).toBe("#c0392b")
	})
})
