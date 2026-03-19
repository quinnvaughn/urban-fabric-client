import {
	FABRIC_SHORTCUTS,
	type FabricShortcutDefinition,
} from "#/features/fabric/keyboard-shortcuts"
import { Box, HStack, Modal, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

const MODAL_COLUMNS = [["Tools", "Edit"], ["View"]] as const

const groupedShortcuts = FABRIC_SHORTCUTS.reduce<
	Record<string, FabricShortcutDefinition[]>
>((groups, shortcut) => {
	if (!groups[shortcut.group]) groups[shortcut.group] = []
	groups[shortcut.group].push(shortcut)
	return groups
}, {})

export function ShortcutsModal({
	open,
	onClose,
}: {
	open: boolean
	onClose: () => void
}) {
	return (
		<Modal open={open} onClose={onClose} size="lg">
			<Modal.Header>
				<Modal.Title>Keyboard shortcuts</Modal.Title>
				<Modal.CloseBtn />
			</Modal.Header>
			<Modal.Body>
				<HStack
					align="start"
					gap="8"
					className={css({ alignItems: "flex-start", flexWrap: "wrap" })}
				>
					{MODAL_COLUMNS.map((column) => (
						<VStack
							key={`column-${column.join("-")}`}
							gap="6"
							className={css({
								alignItems: "stretch",
								flex: 1,
								minWidth: "260px",
							})}
						>
							{column.map((group) => {
								const shortcuts = groupedShortcuts[group]
								if (!shortcuts?.length) return null

								return (
									<VStack
										key={group}
										gap="2"
										className={css({ alignItems: "stretch" })}
									>
										<Typography.Text
											size="xxs"
											weight="semibold"
											letterSpacing="wider"
											transform="uppercase"
											color="stone.400"
										>
											{group}
										</Typography.Text>
										<VStack
											gap="1.5"
											className={css({ alignItems: "stretch" })}
										>
											{shortcuts.map((shortcut) => (
												<HStack
													key={shortcut.id}
													justify="space-between"
													align="center"
													className={css({
														gap: "3",
														py: "1.5",
														borderBottom: "1px solid",
														borderBottomColor: "stone.100",
													})}
												>
													<Typography.Text size="sm" color="stone.700">
														{shortcut.label}
													</Typography.Text>
													<HStack gap="1" className={css({ flexShrink: 0 })}>
														{shortcut.keys.map((key) => (
															<Box
																as="kbd"
																key={`${shortcut.id}-${key}`}
																className={css({
																	minWidth: "6",
																	height: "6",
																	px: "1",
																	display: "inline-flex",
																	alignItems: "center",
																	justifyContent: "center",
																	borderRadius: "sm",
																	border: "1px solid",
																	borderColor: "stone.300",
																	background: "stone.100",
																	color: "stone.700",
																	fontSize: "xs",
																	lineHeight: "none",
																	fontWeight: "600",
																	fontFamily: "sans",
																	boxShadow: "sm",
																})}
															>
																{key}
															</Box>
														))}
													</HStack>
												</HStack>
											))}
										</VStack>
									</VStack>
								)
							})}
						</VStack>
					))}
				</HStack>
			</Modal.Body>
		</Modal>
	)
}
