import { type ShortcutEntry, useKeyboardShortcuts } from "#/lib/hooks"

type FabricShortcutGroup = "Tools" | "Edit" | "View"

export type FabricShortcutId =
	| "selectTool"
	| "drawTool"
	| "deleteSelected"
	| "undo"
	| "redo"
	| "finishDrawing"
	| "cancelDrawing"
	| "zoomIn"
	| "zoomOut"
	| "openShortcuts"
	| "openCommandPalette"

export type FabricShortcutDefinition = {
	id: FabricShortcutId
	label: string
	group: FabricShortcutGroup
	shortcut: string
	keys: string[]
}

export const FABRIC_SHORTCUTS: FabricShortcutDefinition[] = [
	{
		id: "selectTool",
		label: "Select",
		group: "Tools",
		shortcut: "v",
		keys: ["V"],
	},
	{
		id: "drawTool",
		label: "Draw",
		group: "Tools",
		shortcut: "d",
		keys: ["D"],
	},
	{
		id: "deleteSelected",
		label: "Delete selected",
		group: "Edit",
		shortcut: "Delete",
		keys: ["Del"],
	},
	{
		id: "undo",
		label: "Undo last edit or drawing point",
		group: "Edit",
		shortcut: "Meta+z",
		keys: ["⌘", "Z"],
	},
	{
		id: "redo",
		label: "Redo last edit or drawing point",
		group: "Edit",
		shortcut: "Meta+Shift+z",
		keys: ["⌘", "⇧", "Z"],
	},
	{
		id: "finishDrawing",
		label: "Finish drawing",
		group: "Edit",
		shortcut: "Enter",
		keys: ["↩"],
	},
	{
		id: "cancelDrawing",
		label: "Cancel drawing",
		group: "Edit",
		shortcut: "Escape",
		keys: ["Esc"],
	},
	{
		id: "zoomIn",
		label: "Zoom in",
		group: "View",
		shortcut: "Plus",
		keys: ["+"],
	},
	{
		id: "zoomOut",
		label: "Zoom out",
		group: "View",
		shortcut: "Minus",
		keys: ["-"],
	},
	{
		id: "openShortcuts",
		label: "Show shortcuts",
		group: "View",
		shortcut: "Shift+?",
		keys: ["⇧", "?"],
	},
	{
		id: "openCommandPalette",
		label: "Open command palette",
		group: "Tools",
		shortcut: "CMD+K",
		keys: ["⌘", "K"],
	},
]

export const PANEL_SHORTCUT_IDS = [
	"selectTool",
	"drawTool",
	"deleteSelected",
	"undo",
	"redo",
	"cancelDrawing",
	"openCommandPalette",
] as const satisfies readonly FabricShortcutId[]

export const MAP_CONTROL_SHORTCUT_IDS = [
	"zoomIn",
	"zoomOut",
	"openShortcuts",
] as const satisfies readonly FabricShortcutId[]

// Usage examples:
// 1) Register panel shortcuts:
// useFabricKeyboardShortcuts({
//   ids: PANEL_SHORTCUT_IDS,
//   deps: {
//     selectTool: () => { ... },
//     drawTool: () => { ... },
//     deleteSelected: () => { ... },
//     undo: () => { ... },
//     redo: () => { ... },
//     finishDrawing: () => { ... },
//     cancelDrawing: () => { ... },
//   },
// })
//
// 2) Register shortcuts that need external deps:
// useFabricKeyboardShortcuts({
//   ids: MAP_CONTROL_SHORTCUT_IDS,
//   deps: {
//     zoomIn: () => map.zoomIn(),
//     zoomOut: () => map.zoomOut(),
//     openShortcuts: () => open("shortcuts"),
//   },
// })
//
// 3) Add a new shortcut end-to-end:
// - Add id to FabricShortcutId
// - Add entry in FABRIC_SHORTCUTS
// - Add behavior in runFabricShortcut
// - Add id to the relevant *_SHORTCUT_IDS list

export function getFabricShortcut(id: FabricShortcutId) {
	return FABRIC_SHORTCUTS.find((shortcut) => shortcut.id === id)
}

export function getFabricShortcutHint(id: FabricShortcutId) {
	return getFabricShortcut(id)?.keys.join(" ")
}

type FabricShortcutDepsFor<TIds extends readonly FabricShortcutId[]> = {
	[K in TIds[number]]: () => void
}

function runFabricShortcut<TIds extends readonly FabricShortcutId[]>(
	id: TIds[number],
	deps: FabricShortcutDepsFor<TIds>,
) {
	deps[id]()
}

function createFabricShortcutEntries<TIds extends readonly FabricShortcutId[]>(
	ids: TIds,
	deps: FabricShortcutDepsFor<TIds>,
): ShortcutEntry[] {
	return FABRIC_SHORTCUTS.filter((shortcut) => ids.includes(shortcut.id)).map(
		({ id, shortcut }) => ({
			shortcut,
			handler: () => runFabricShortcut(id as TIds[number], deps),
		}),
	)
}

type UseFabricKeyboardShortcutsOptions<
	TIds extends readonly FabricShortcutId[],
> = {
	ids: TIds
	deps: FabricShortcutDepsFor<TIds>
}

export function useFabricKeyboardShortcuts<
	TIds extends readonly FabricShortcutId[],
>({ ids, deps }: UseFabricKeyboardShortcutsOptions<TIds>) {
	useKeyboardShortcuts(createFabricShortcutEntries(ids, deps))
}
