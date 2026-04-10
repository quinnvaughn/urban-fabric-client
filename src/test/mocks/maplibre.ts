import { vi } from "vitest"

// ── Valid MapLibre paint property names by layer type ─────────────────────────
// Any test that calls addLayer or setPaintProperty with a name not in these
// sets will throw, catching typos like "circle-strokeWidth" at test time.

const VALID_LINE_PAINT = new Set([
	"line-opacity",
	"line-color",
	"line-translate",
	"line-translate-anchor",
	"line-width",
	"line-gap-width",
	"line-offset",
	"line-blur",
	"line-dasharray",
	"line-pattern",
	"line-gradient",
	"line-trim-offset",
	"line-border-width",
	"line-border-color",
	// transition variants
	"line-opacity-transition",
	"line-color-transition",
	"line-width-transition",
	"line-blur-transition",
	"line-border-color-transition",
])

const VALID_CIRCLE_PAINT = new Set([
	"circle-radius",
	"circle-color",
	"circle-blur",
	"circle-opacity",
	"circle-translate",
	"circle-translate-anchor",
	"circle-pitch-scale",
	"circle-pitch-alignment",
	"circle-stroke-width", // NOT "circle-strokeWidth"
	"circle-stroke-color",
	"circle-stroke-opacity",
	// transition variants
	"circle-radius-transition",
	"circle-color-transition",
	"circle-opacity-transition",
	"circle-stroke-width-transition",
	"circle-stroke-color-transition",
	"circle-stroke-opacity-transition",
])

const VALID_PAINT_BY_TYPE: Record<string, Set<string>> = {
	line: VALID_LINE_PAINT,
	circle: VALID_CIRCLE_PAINT,
}

function validatePaintProps(layerType: string, paint: Record<string, unknown>) {
	const valid = VALID_PAINT_BY_TYPE[layerType]
	if (!valid) return
	for (const key of Object.keys(paint)) {
		if (!valid.has(key)) {
			throw new Error(
				`Invalid MapLibre paint property "${key}" for layer type "${layerType}". ` +
					`Did you mean "${key.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`).replace(/^-/, "")}"?`,
			)
		}
	}
}

// ── Mock Map class ────────────────────────────────────────────────────────────

type LayerRecord = { type: string; paint?: Record<string, unknown> }

export class MockMap {
	private sources: Map<string, unknown> = new Map()
	private layers: Map<string, LayerRecord> = new Map()
	private paintProps: Map<string, Record<string, unknown>> = new Map()
	private layoutProps: Map<string, Record<string, unknown>> = new Map()
	private listeners: Map<string, Array<(...args: unknown[]) => void>> = new Map()

	canvas = {
		style: { cursor: "" },
		getBoundingClientRect: vi.fn(() => ({ left: 0, top: 0 })),
	}

	doubleClickZoom = { disable: vi.fn(), enable: vi.fn() }
	dragPan = { disable: vi.fn(), enable: vi.fn() }

	getCanvas() {
		return this.canvas
	}

	addSource(id: string, spec: unknown) {
		this.sources.set(id, spec)
	}

	removeSource(id: string) {
		this.sources.delete(id)
	}

	getSource(id: string) {
		if (!this.sources.has(id)) return undefined
		return {
			setData: vi.fn(),
		}
	}

	addLayer(spec: {
		id: string
		type: string
		source?: string
		paint?: Record<string, unknown>
		layout?: Record<string, unknown>
	}) {
		if (spec.paint) validatePaintProps(spec.type, spec.paint)
		this.layers.set(spec.id, { type: spec.type, paint: spec.paint })
		this.paintProps.set(spec.id, { ...(spec.paint ?? {}) })
		this.layoutProps.set(spec.id, { ...(spec.layout ?? {}) })
	}

	removeLayer(id: string) {
		this.layers.delete(id)
		this.paintProps.delete(id)
		this.layoutProps.delete(id)
	}

	hasLayer(id: string) {
		return this.layers.has(id)
	}

	setPaintProperty(layerId: string, prop: string, value: unknown) {
		const layer = this.layers.get(layerId)
		if (layer) validatePaintProps(layer.type, { [prop]: value })
		const existing = this.paintProps.get(layerId) ?? {}
		this.paintProps.set(layerId, { ...existing, [prop]: value })
	}

	getPaintProperty(layerId: string, prop: string) {
		return this.paintProps.get(layerId)?.[prop]
	}

	setLayoutProperty(layerId: string, prop: string, value: unknown) {
		const existing = this.layoutProps.get(layerId) ?? {}
		this.layoutProps.set(layerId, { ...existing, [prop]: value })
	}

	getStyle() {
		return {
			layers: Array.from(this.layers.entries()).map(([id, l]) => ({
				id,
				type: l.type,
			})),
		}
	}

	on(event: string, handler: (...args: unknown[]) => void) {
		const handlers = this.listeners.get(event) ?? []
		this.listeners.set(event, [...handlers, handler])
	}

	off(event: string, handler: (...args: unknown[]) => void) {
		const handlers = this.listeners.get(event) ?? []
		this.listeners.set(
			event,
			handlers.filter((h) => h !== handler),
		)
	}

	unproject(_point: [number, number]) {
		return { lng: 0, lat: 0 }
	}

	queryRenderedFeatures(_point: unknown, _opts?: unknown) {
		return []
	}

	// Test helpers — not part of the real MapLibre API
	_getPaintProps(layerId: string) {
		return this.paintProps.get(layerId) ?? {}
	}

	_getLayerIds() {
		return Array.from(this.layers.keys())
	}
}
