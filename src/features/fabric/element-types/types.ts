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
	baseMapStyle: {
		color: string
		width: number
		dasharray?: number[]
		opacity?: number
	}
	properties: PropertyDescriptor[]
	calculated: CalculatedField[]
}

// ── Category — what renders as a section in the element panel ────────────────

export type ElementCategory = {
	id: string
	title: string
	elements: ElementDescriptor[]
}
