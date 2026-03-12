// ── Property panel inputs ────────────────────────────────────────────────────

type StepperInput = {
	kind: "stepper"
	min: number
	max: number
	step: number
	unit?: string
}
type SelectInput = {
	kind: "select"
	options: { label: string; value: string }[]
}
type SegmentedInput = {
	kind: "segmented"
	options: { label: string; value: string }[]
}
type ToggleInput = { kind: "toggle" }

type PropertyInput = StepperInput | SelectInput | SegmentedInput | ToggleInput

type PropertyDescriptor<T = unknown> = {
	key: string
	label: string
	default: T
	input: PropertyInput
	toMapStyle: (value: T) => Partial<LinePaintOverrides>
}

type LinePaintOverrides = {
	"line-width"?: number
	"line-color"?: string
	"line-opacity"?: number
	"line-dasharray"?: number[]
}

// ── Line layer visual style ───────────────────────────────────────────────────
//
// Describes all MapLibre layers needed to render a line element type.
// Each element type compiles down to 4–5 stacked layers:
//
//   1. casing      — wide, low-opacity version of the main color for depth
//   2. main        — the primary stroke
//   3. selected    — overrides for main when feature-state "selected: true"
//   4. outline     — two dashed lines offset above/below, selected state only
//   5. endpoints   — circle layer at line vertices, selected state only
//
// The drawPreview layer is ephemeral — driven by draw state, not feature state.

export type LineLayerStyle = {
	// Main stroke
	color: string
	width: number
	opacity?: number
	lineCap?: "butt" | "round" | "square"
	lineJoin?: "bevel" | "round" | "miter"
	dasharray?: number[]

	// Casing — rendered beneath the main stroke using the same color at reduced
	// opacity and greater width. Gives lines visual depth on the map.
	casingWidth?: number
	casingOpacity?: number

	// Selected state — applied as a separate filtered layer when
	// feature-state "selected: true". Overrides width and lineCap on the main
	// stroke, and adds the dashed bounding outline.
	selected?: {
		color?: string
		width?: number
		lineCap?: "butt" | "round" | "square"
		// Bounding outline: two dashed line layers offset symmetrically above
		// and below the main stroke to approximate a selection bounding box.
		outlineColor?: string
		outlineOpacity?: number
		outlineDasharray?: number[]
		outlineOffset?: number // px — applied as +n and -n to produce both sides
		outlineWidth?: number
	}

	// Endpoint nodes — a separate circle layer rendered at each vertex of the
	// line. Only visible when feature-state "selected: true". The glow is a
	// larger circle at low opacity behind the main node circle.
	endpoints?: {
		radius: number
		fillColor: string
		strokeColor: string
		strokeWidth: number
		glowRadius: number
		glowOpacity: number
	}

	// Draw preview — ghost line shown while the user is placing nodes.
	// Rendered as an ephemeral layer managed by draw state, not feature state.
	// Intentionally lighter/more transparent than the resting style so it reads
	// as "in progress" rather than a committed element.
	drawPreview?: {
		color: string
		width: number
		opacity: number
		dasharray: number[]
		lineCap: "butt" | "round" | "square"
	}
}

// ── Element instance — what gets persisted ───────────────────────────────────

export type ElementInstance = {
	id: string
	typeId: string
	geometry: "line" // | "polygon" | "point" in v2
	coordinates: [number, number][]
	// Current values for each property in the descriptor
	properties: Record<string, unknown>
}

// ── Persistence handler — agnostic of auth state ────────────────────────────

export type PersistenceHandler = {
	load: () => Promise<ElementInstance[]>
	save: (elements: ElementInstance[]) => Promise<void>
}

// Two implementations you swap in depending on auth state:
export const localStorageHandler = (fabricId: string): PersistenceHandler => ({
	load: async () => {
		const raw = localStorage.getItem(`fabric:${fabricId}:elements`)
		return raw ? JSON.parse(raw) : []
	},
	save: async (elements) => {
		localStorage.setItem(
			`fabric:${fabricId}:elements`,
			JSON.stringify(elements),
		)
	},
})

// export const apiHandler = (fabricId: string): PersistenceHandler => ({
// 	load: async () => {
// 		const res = await fetch(`/api/fabrics/${fabricId}/elements`)
// 		return res.json()
// 	},
// 	save: async (elements) => {
// 		await fetch(`/api/fabrics/${fabricId}/elements`, {
// 			method: "PUT",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify(elements),
// 		})
// 	},
// })

// ── Element type descriptor ──────────────────────────────────────────────────

type CalculatedField = {
	key: string
	label: string
	unit?: string
}

export type ElementDescriptor = {
	id: string
	title: string
	geometry: "line"
	draw: "click-to-place-points"
	baseMapStyle: LineLayerStyle
	properties: PropertyDescriptor[]
	calculated: CalculatedField[]
}

// ── Category — what renders as a section in the element panel ────────────────

export type ElementCategory = {
	id: string
	title: string
	elements: ElementDescriptor[]
}
