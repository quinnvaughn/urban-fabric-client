import { ELEMENT_CATEGORIES } from "#/features/fabric/element-types"
import type { ElementDescriptor } from "#/features/fabric/element-types/types"
import { CommandPalette, type PaletteItem } from "#/features/ui"
import { useFabricStore } from "../fabric-store"

function buildPaletteItems(
	setActiveElement: (element: ElementDescriptor | null) => void,
	setActiveTool: (tool: "select" | "draw") => void,
): PaletteItem[] {
	return ELEMENT_CATEGORIES.flatMap((category) =>
		category.elements.map((element) => ({
			id: element.id,
			label: element.title,
			group: category.title,
			color: element.baseMapStyle.color,
			onSelect: () => {
				setActiveElement(element)
				setActiveTool("draw")
			},
		})),
	)
}

export function EditorCommandPalette() {
	const commandPaletteOpen = useFabricStore((state) => state.commandPaletteOpen)
	const closeCommandPalette = useFabricStore(
		(state) => state.closeCommandPalette,
	)
	const setActiveElement = useFabricStore((state) => state.setActiveElement)
	const setActiveTool = useFabricStore((state) => state.setActiveTool)

	const items = buildPaletteItems(setActiveElement, setActiveTool)

	return (
		<CommandPalette
			open={commandPaletteOpen}
			onClose={closeCommandPalette}
			items={items}
			placeholder="Search elements..."
		/>
	)
}
