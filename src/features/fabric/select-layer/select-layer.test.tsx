import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MockMap } from "#/test/mocks/maplibre"
import { elementInstanceIdFromLayerId, SelectLayer } from "./select-layer"

// ── Module mocks ──────────────────────────────────────────────────────────────

const mockMap = new MockMap()

vi.mock("../fabric-map", () => ({
	useMap: () => mockMap,
	SELECT_LAYER_IDS: [],
	SELECT_SOURCE_IDS: [],
	removeLayersIfPresent: vi.fn(),
	removeSourcesIfPresent: vi.fn(),
	hasLayer: (map: MockMap, id: string) => map.hasLayer(id),
}))

vi.mock("../fabric-store", () => ({
	fabricStore: { state: { selectedInstanceId: null, elements: [] } },
	useFabricStore: () => ({
		activeTool: "select",
		elements: [],
		selectedInstanceId: null,
		setSelectedInstanceId: vi.fn(),
		deleteElement: vi.fn(),
		updateElement: vi.fn(),
		snapshot: vi.fn(),
	}),
}))

vi.mock("../osrm-utils", () => ({
	useRouteBetween: () => vi.fn(),
	flattenSegments: (segs: [number, number][][]) =>
		segs.flatMap((s, i) => (i === 0 ? s : s.slice(1))),
}))

vi.mock("../element-types", async (importOriginal) => {
	const actual = await importOriginal<typeof import("../element-types")>()
	return actual
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("SelectLayer", () => {
	it("resolves selectable line, arrow, and SVG symbol layers to the owning element id", () => {
		expect(elementInstanceIdFromLayerId("el-abc-123")).toBe("abc-123")
		expect(elementInstanceIdFromLayerId("el-abc-123-arrows")).toBe("abc-123")
		expect(elementInstanceIdFromLayerId("el-abc-123-symbol")).toBe("abc-123")
		expect(elementInstanceIdFromLayerId("el-abc-123-casing")).toBeNull()
		expect(elementInstanceIdFromLayerId("road-label")).toBeNull()
	})

	it("adds all circle and line layers with valid MapLibre paint property names", () => {
		// MockMap.addLayer and MockMap.setPaintProperty throw if an invalid
		// property name is used (e.g. "circle-strokeWidth" instead of
		// "circle-stroke-width"), so simply rendering the component is the test.
		expect(() => render(<SelectLayer />)).not.toThrow()
	})

	it("adds endpoint circle layers to the map", () => {
		const layerIds = mockMap._getLayerIds()
		expect(layerIds).toContain("select-endpoints-node")
		expect(layerIds).toContain("select-endpoints-glow")
		expect(layerIds).toContain("select-endpoints-snap-ring")
	})

	it("adds selection line layers to the map", () => {
		const layerIds = mockMap._getLayerIds()
		expect(layerIds).toContain("select-main")
		expect(layerIds).toContain("select-outline-above")
		expect(layerIds).toContain("select-outline-below")
	})

	it("initializes endpoint circles with opacity 0", () => {
		expect(
			mockMap._getPaintProps("select-endpoints-node")["circle-opacity"],
		).toBe(0)
		expect(
			mockMap._getPaintProps("select-endpoints-node")["circle-stroke-opacity"],
		).toBe(0)
	})
})
