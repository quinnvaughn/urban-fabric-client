import { MousePointer2, PencilLine, Redo, Undo } from "lucide-react"
import { ELEMENT_CATEGORIES } from "#/features/fabric/element-types"
import type { ElementDescriptor } from "#/features/fabric/element-types/types"
import {
	PANEL_SHORTCUT_IDS,
	useFabricKeyboardShortcuts,
} from "#/features/fabric/keyboard-shortcuts"
import { Box, Grid, HStack, Tooltip, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { useFabricStore } from "../fabric-store"

type Tool = {
	title: "select" | "draw"
	tooltip: string
	icon: React.ReactNode
	fill?: boolean
}

type Action = {
	title: "undo" | "redo"
	tooltip: string
	icon: React.ReactNode
}

const tools: Tool[] = [
	{
		title: "select",
		tooltip: "Select V",
		icon: <MousePointer2 size={14} />,
		fill: true,
	},
	{ title: "draw", tooltip: "Draw D", icon: <PencilLine size={14} /> },
]

const actions: Action[] = [
	// command icon and shift icon. redo is command + shift + z on mac, ctrl + y on windows, so we can show both shortcuts in the tooltip but only one icon
	{ title: "undo", tooltip: "Undo ⌘+Z", icon: <Undo size={14} /> },
	{ title: "redo", tooltip: "Redo ⌘+⇧+Z", icon: <Redo size={14} /> },
]

export function ElementPanel() {
	const {
		activeElement,
		activeTool,
		setActiveElement,
		setActiveTool,
		undo,
		redo,
		canUndo,
		canRedo,
		deleteElement,
		selectedInstanceId,
		setSelectedInstanceId,
		openCommandPalette,
	} = useFabricStore()

	useFabricKeyboardShortcuts({
		ids: PANEL_SHORTCUT_IDS,
		deps: {
			selectTool: () => {
				setActiveTool("select")
				setActiveElement(null)
			},
			drawTool: () => {
				setActiveTool("draw")
			},
			deleteSelected: () => {
				if (!selectedInstanceId) return
				deleteElement(selectedInstanceId)
				setSelectedInstanceId(null)
			},
			undo,
			redo,
			cancelDrawing: () => {
				if (activeTool === "draw") {
					setActiveTool("select")
					setActiveElement(null)
					return
				}

				if (!selectedInstanceId) return
				setSelectedInstanceId(null)
			},
			openCommandPalette,
		},
	})

	function isActiveElement(element: ElementDescriptor) {
		return activeElement?.id === element.id
	}

	function isActiveTool(tool: string) {
		return activeTool === tool
	}

	function handleElementClick(element: ElementDescriptor) {
		setActiveElement(element)
		setActiveTool("draw")
	}

	function handleToolClick(tool: Tool) {
		setActiveTool(tool.title)
		if (tool.title === "select") setActiveElement(null)
	}

	return (
		<Box
			className={css({
				position: "fixed",
				top: "calc(var(--uf-header-height) + 20px)",
				background: "white",
				left: "5",
				zIndex: "panel",
				width: "200px",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
				borderRadius: "lg",
				boxShadow: "md",
				animation: "fadeInLeft 0.42s var(--easings-spring) 0.08s both",
			})}
		>
			<Grid
				gap="0.5"
				align="center"
				justify="center"
				columns={"1fr 1fr 1fr 1fr 1fr"}
				className={css({
					padding: "1.5",
					borderBottom: "1px solid",
					borderBottomColor: "border.subtle",
					flexShrink: 0,
				})}
			>
				{tools.map((tool) => (
					<Tooltip key={tool.title} placement="bottom">
						<Tooltip.Trigger>
							<button
								type="button"
								key={tool.title}
								data-active={isActiveTool(tool.title)}
								onClick={() => handleToolClick(tool)}
								className={css({
									position: "relative",
									width: "8",
									height: "8",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									border: "none",
									borderRadius: "md",
									background: "transparent",
									cursor: "pointer",
									flexShrink: 0,
									color: "stone.600",
									transition:
										"background 150ms var(--easings-in-out), color 150ms var(--easings-in-out)",
									_hover: { background: "stone.200", color: "stone.900" },
									"& svg": { fill: tool.fill ? "currentColor" : "none" },
									"&[data-active='true']": {
										background: { base: "teal.700", _hover: "teal.700" },
										color: { base: "white", _hover: "white" },
									},
								})}
							>
								{tool.icon}
							</button>
						</Tooltip.Trigger>
						<Tooltip.Content>{tool.tooltip}</Tooltip.Content>
					</Tooltip>
				))}
				<Box
					className={css({
						width: "px",
						height: "18px",
						background: "stone.300",
						margin: "0 2px",
						flexShrink: 0,
					})}
				/>
				{actions.map((action) => (
					<Tooltip key={action.title} placement="bottom">
						<Tooltip.Trigger>
							<button
								type="button"
								disabled={
									(action.title === "undo" && !canUndo) ||
									(action.title === "redo" && !canRedo)
								}
								onClick={action.title === "undo" ? undo : redo}
								className={css({
									width: "8",
									height: "8",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									border: "none",
									borderRadius: "md",
									background: "transparent",
									cursor: "pointer",
									flexShrink: 0,
									color: "stone.600",
									transition:
										"background 150ms var(--easings-in-out), color 150ms var(--easings-in-out)",
									_hover: { background: "stone.200", color: "stone.900" },
									_disabled: {
										cursor: "not-allowed",
										color: "stone.400",
										_hover: { background: "transparent", color: "stone.400" },
										"& svg": { stroke: "currentColor" },
										"&[data-active='true']": {
											background: "transparent",
											color: "stone.400",
											_hover: { background: "transparent", color: "stone.400" },
										},
									},
								})}
							>
								{action.icon}
							</button>
						</Tooltip.Trigger>
						<Tooltip.Content>{action.tooltip}</Tooltip.Content>
					</Tooltip>
				))}
			</Grid>

			<VStack gap="0" className={css({ paddingBottom: "2" })}>
				{ELEMENT_CATEGORIES.map((category) => (
					<VStack key={category.id} gap="0">
						<HStack
							align="center"
							className={css({
								px: "2.5",
								paddingTop: "3",
								paddingBottom: "1.5",
							})}
						>
							<Typography.Text
								size="xxs"
								weight="semibold"
								letterSpacing="wider"
								transform="uppercase"
								color="stone.400"
							>
								{category.title}
							</Typography.Text>
						</HStack>
						<VStack gap="px" className={css({ px: "1.5" })}>
							{category.elements.map((element) => (
								<Tooltip key={element.id} placement="top-start">
									<Tooltip.Trigger>
										<button
											type="button"
											data-active={isActiveElement(element)}
											onClick={() => handleElementClick(element)}
											className={css({
												display: "flex",
												alignItems: "center",
												gap: "2",
												padding: "2",
												borderRadius: "md",
												cursor: "pointer",
												textAlign: "left",
												width: "100%",
												transition: "background 150ms var(--easings-in-out)",
												position: "relative",
												fontWeight: "500",
												color: "stone.800",
												background: "transparent",
												_hover: { background: "stone.200" },
												"&[data-active='true']": {
													background: { base: "teal.100", _hover: "teal.100" },
													color: "teal.700",
													fontWeight: "600",
												},
											})}
										>
											{isActiveElement(element) && (
												<Box
													as="span"
													className={css({
														left: 0,
														position: "absolute",
														top: "5px",
														bottom: "5px",
														width: "2.5px",
														borderRadius: "full",
														background: "teal.600",
													})}
												/>
											)}
											<Box
												className={css({
													width: "2.5",
													height: "2.5",
													borderRadius: "2px",
													flexShrink: 0,
												})}
												style={{ backgroundColor: element.baseMapStyle.color }}
											/>
											<Typography.Text
												size="sm"
												font="sans"
												lineHeight="tight"
												className={css({ flex: 1 })}
											>
												{element.title}
											</Typography.Text>
										</button>
									</Tooltip.Trigger>
									<Tooltip.Content>{element.description}</Tooltip.Content>
								</Tooltip>
							))}
						</VStack>
					</VStack>
				))}
			</VStack>
		</Box>
	)
}
