import type { ReactNode } from "react"
import { HStack, Kbd, Modal, Typography, VStack } from "#/features/ui"

type Tool = {
	title: "select" | "draw" | "command palette"
	keyboardShortcut: string
	description: ReactNode
}

const tools: Tool[] = [
	{
		title: "select",
		keyboardShortcut: "V",
		description: (
			<>
				Click to select a segment. Drag to move. <Kbd>Del</Kbd> to delete.
				Double-click a waypoint to remove it from the segment.
			</>
		),
	},
	{
		title: "draw",
		keyboardShortcut: "D",
		description: (
			<>
				Click to place waypoints. Press <Kbd>↵</Kbd> to finish or <Kbd>Esc</Kbd>{" "}
				to cancel. Use <Kbd>⌘</Kbd> + <Kbd>Z</Kbd> and <Kbd>⌘</Kbd> +{" "}
				<Kbd>⇧</Kbd> + <Kbd>Z</Kbd> to undo and redo placed points before the
				element is created. Road-based elements follow the street network.
			</>
		),
	},
	{
		title: "command palette",
		keyboardShortcut: "⌘ K",
		description: (
			<>
				Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to open the command palette. Search
				for any element type by name and press <Kbd>↵</Kbd> to immediately start
				drawing it.
			</>
		),
	},
]

export function ToolRefModal({
	open,
	onClose,
}: {
	open: boolean
	onClose: () => void
}) {
	return (
		<Modal open={open} onClose={onClose}>
			<Modal.Header>
				<Modal.Title>Tool Reference</Modal.Title>
				<Modal.CloseBtn />
			</Modal.Header>
			<Modal.Body>
				<VStack gap="8">
					{tools.map((tool) => (
						<VStack key={tool.title} gap="2" align="start">
							<HStack gap="2" align="center">
								<Typography.Text
									weight="bold"
									size="xxs"
									letterSpacing="wider"
									transform="uppercase"
									color="stone.400"
								>
									{tool.title}
								</Typography.Text>
								<Typography.Text weight="medium" size="sm" color="stone.500">
									{tool.keyboardShortcut}
								</Typography.Text>
							</HStack>
							<Typography.Text size="sm" color="stone.700" lineHeight="relaxed">
								{tool.description}
							</Typography.Text>
						</VStack>
					))}
				</VStack>
			</Modal.Body>
		</Modal>
	)
}
