import type { ReactNode } from "react"
import { HStack, Modal, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Tool = {
	title: "select" | "draw" | "command palette"
	keyboardShortcut: string
	description: ReactNode
}

const kbd = css({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	minWidth: "6",
	height: "6",
	px: "1",
	background: "stone.100",
	borderRadius: "sm",
	border: "1px solid",
	borderColor: "stone.300",
	fontSize: "xs",
	fontWeight: "medium",
	color: "stone.700",
	whiteSpace: "nowrap",
	fontFamily: "sans",
	lineHeight: "none",
	boxShadow: "sm",
})

const tools: Tool[] = [
	{
		title: "select",
		keyboardShortcut: "V",
		description: (
			<>
				Click to select a segment. Drag to move. <kbd className={kbd}>Del</kbd>{" "}
				to delete. Double-click a waypoint to remove it from the segment.
			</>
		),
	},
	{
		title: "draw",
		keyboardShortcut: "D",
		description: (
			<>
				Click to place waypoints along a road. Press{" "}
				<kbd className={kbd}>↵</kbd> to finish or <kbd className={kbd}>Esc</kbd>{" "}
				to cancel. Snaps to the road network automatically.
			</>
		),
	},
	{
		title: "command palette",
		keyboardShortcut: "/",
		description: (
			<>
				Press <kbd className={kbd}>/</kbd> to open the command palette. Search
				for any element type by name and press <kbd className={kbd}>↵</kbd> to
				immediately start drawing it.
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
									tracking="wider"
									transform="uppercase"
									color="stone.400"
								>
									{tool.title}
								</Typography.Text>
								<Typography.Text weight="medium" size="sm" color="stone.500">
									{tool.keyboardShortcut}
								</Typography.Text>
							</HStack>
							<Typography.Text size="sm" color="stone.700" leading="relaxed">
								{tool.description}
							</Typography.Text>
						</VStack>
					))}
				</VStack>
			</Modal.Body>
		</Modal>
	)
}
