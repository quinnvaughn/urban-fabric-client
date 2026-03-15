// ── Property panel inputs ────────────────────────────────────────────────────

import type { ApolloClient } from "@apollo/client"
import { UpdateFabricElementsDocument } from "#/graphql/generated"

type StepperInput = {
	kind: "stepper"
	min: number
	max: number
	step: number
	unit?: string
}
type SelectInput = {
	kind: "select"
	options: {
		label: string
		value: string
		icon?: React.ReactNode
		description?: string
	}[]
}
type SegmentedInput = {
	kind: "segmented"
	options: {
		label: string
		value: string
		icon?: React.ReactNode
		description?: string
	}[]
}
type ToggleInput = { kind: "toggle" }

type PropertyInput = StepperInput | SelectInput | SegmentedInput | ToggleInput

type PropertyConstraint =
	| { kind: "max-sibling"; sibling: string; offset: number } // value must be < sibling - offset
	| { kind: "min-sibling"; sibling: string; offset: number } // value must be > sibling + offset

export type PropertyDescriptor<T = unknown> = {
	key: string
	label: string
	description?: string
	default: T
	input: PropertyInput
	toMapStyle: (value: T) => Partial<LinePaint>
	constraints?: PropertyConstraint[]
}

export type LinePaint = {
	"line-color"?: string
	"line-width"?: number
	"line-opacity"?: number
	"line-dasharray"?: number[]
	"line-casing-opacity"?: number // applied to casing layer, not the main stroke
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

	// Selected state — applied as a separate filtered layer when selected.
	// outlineColor and the main stroke color are derived from baseMapStyle.color
	// at render time.
	selected?: {
		color?: string
		width?: number
		lineCap?: "butt" | "round" | "square"
		outlineOpacity?: number
		outlineDasharray?: number[]
		outlineOffset?: number
		outlineWidth?: number
	}

	// Endpoint nodes — rendered at each user-placed waypoint, selected state only.
	// strokeColor and snapRingColor are derived from baseMapStyle.color at render time.
	endpoints?: {
		radius: number
		fillColor: string // always white
		strokeWidth: number
		glowRadius: number
		glowOpacity: number
		snapRingRadius: number
		snapRingOpacity: number
		snapRingDasharray: number[]
		snapRingWidth: number
	}

	// Small pill handle at the line midpoint, selected state only.
	// strokeColor is derived from baseMapStyle.color at render time.
	midHandle?: {
		width: number
		height: number
		radius: number
		fillColor: string // always white
		strokeWidth: number
	}

	// Draw preview — ghost line shown while the user is placing nodes.
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
	// User-placed waypoints (subset of coordinates used to generate the route)
	waypoints: [number, number][]
	// OSRM-routed coordinate arrays between each consecutive pair of waypoints.
	// segments[i] is the routed path from waypoints[i] to waypoints[i+1].
	// Optional for backwards compatibility with elements saved before this field was added.
	segments?: [number, number][][]
	// Current values for each property in the descriptor
	properties: Record<string, unknown>
}

export type GuestFabric = {
	id: string
	title: string
	center: { lat: number; lng: number }
	zoom: number
	elements: ElementInstance[]
	thumbnail?: string
}

export function readGuestFabric(guestStorageKey = "guest-fabric") {
	if (typeof window === "undefined") return null
	const raw = localStorage.getItem(guestStorageKey)
	if (!raw) return null
	return JSON.parse(raw) as GuestFabric
}

export function writeGuestFabric(
	fabric: GuestFabric,
	guestStorageKey = "guest-fabric",
) {
	if (typeof window === "undefined") return
	localStorage.setItem(guestStorageKey, JSON.stringify(fabric))
}

export function updateGuestFabric(
	updater: (current: GuestFabric) => GuestFabric,
	guestStorageKey = "guest-fabric",
) {
	const existing = readGuestFabric(guestStorageKey)
	if (!existing) return
	writeGuestFabric(updater(existing), guestStorageKey)
}

export function getOrCreateGuestFabric(
	center: { lat: number; lng: number },
	guestStorageKey = "guest-fabric",
) {
	const existing = readGuestFabric(guestStorageKey)
	if (existing) {
		if (Array.isArray(existing.elements)) return existing
		const migrated: GuestFabric = { ...existing, elements: [] }
		writeGuestFabric(migrated, guestStorageKey)
		return migrated
	}

	const fabric: GuestFabric = {
		id: crypto.randomUUID(),
		title: "Untitled Fabric",
		center,
		zoom: 15,
		elements: [],
	}
	writeGuestFabric(fabric, guestStorageKey)
	return fabric
}

// ── Persistence handler — agnostic of auth state ────────────────────────────

export type PersistenceHandler = {
	load?: () => Promise<ElementInstance[]>
	save: (elements: ElementInstance[]) => Promise<void>
}

// Two implementations you swap in depending on auth state:
export const localStorageHandler = (
	guestStorageKey = "guest-fabric",
): PersistenceHandler => ({
	load: async () => {
		if (typeof window === "undefined") return []
		const raw = localStorage.getItem(guestStorageKey)
		if (!raw) return []
		const parsed = JSON.parse(raw) as { elements?: ElementInstance[] }
		return Array.isArray(parsed.elements) ? parsed.elements : []
	},
	save: async (elements) => {
		if (typeof window === "undefined") return
		const raw = localStorage.getItem(guestStorageKey)
		const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
		localStorage.setItem(
			guestStorageKey,
			JSON.stringify({ ...parsed, elements }),
		)
	},
})

export const apiHandler = (
	fabricId: string,
	client: ApolloClient,
): PersistenceHandler => ({
	save: async (elements) => {
		await client.mutate({
			mutation: UpdateFabricElementsDocument,
			variables: {
				input: {
					elements,
					id: fabricId,
				},
			},
		})
	},
})

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
	excludes?: string[]
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
