import { MousePointer2, PencilLine, Redo, Undo } from "lucide-react"
import { useEffect } from "react"
import { ELEMENT_CATEGORIES } from "#/features/fabric/element-types"
import type { ElementDescriptor } from "#/features/fabric/element-types/types"
import { Box, Grid, HStack, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { useFabricStore } from "../fabric-store"

type Tool = {
	title: "select" | "draw"
	icon: React.ReactNode
	fill?: boolean
}

type Action = {
	title: "undo" | "redo"
	icon: React.ReactNode
}

const tools: Tool[] = [
	{ title: "select", icon: <MousePointer2 size={14} />, fill: true },
	{ title: "draw", icon: <PencilLine size={14} /> },
]

const actions: Action[] = [
	{ title: "undo", icon: <Undo size={14} /> },
	{ title: "redo", icon: <Redo size={14} /> },
]

export function ElementPanel() {
	const activeElement = useFabricStore((state) => state.activeElement)
	const activeTool = useFabricStore((state) => state.activeTool)
	const setActiveElement = useFabricStore((state) => state.setActiveElement)
	const setActiveTool = useFabricStore((state) => state.setActiveTool)

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

	useEffect(() => {
		// add keyboard shortcuts for tools
		function handleKeyDown(event: KeyboardEvent) {
			if (
				event.target instanceof HTMLInputElement ||
				event.target instanceof HTMLTextAreaElement ||
				(event.target instanceof HTMLElement && event.target.isContentEditable)
			) {
				return
			}

			// s for select tool, d for draw tool (no modifier to avoid browser conflicts)
			if (
				event.key === "s" &&
				!event.metaKey &&
				!event.ctrlKey &&
				!event.altKey
			) {
				setActiveTool("select")
				setActiveElement(null)
			} else if (
				event.key === "d" &&
				!event.metaKey &&
				!event.ctrlKey &&
				!event.altKey
			) {
				setActiveTool("draw")
			}
		}

		window.addEventListener("keydown", handleKeyDown, true)
		return () => window.removeEventListener("keydown", handleKeyDown, true)
	}, [setActiveTool, setActiveElement])

	return (
		<Box
			className={css({
				position: "fixed",
				top: "calc(var(--uf-header-height) + 20px)",
				background: "white",
				left: "5",
				zIndex: 100,
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
					<button
						type="button"
						key={action.title}
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
						})}
					>
						{action.icon}
					</button>
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
								tracking="wider"
								transform="uppercase"
								color="stone.400"
							>
								{category.title}
							</Typography.Text>
						</HStack>
						<VStack gap="px" className={css({ px: "1.5" })}>
							{category.elements.map((element) => (
								<button
									key={element.id}
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
										leading="tight"
										className={css({ flex: 1 })}
									>
										{element.title}
									</Typography.Text>
								</button>
							))}
						</VStack>
					</VStack>
				))}
			</VStack>
		</Box>
	)
}
