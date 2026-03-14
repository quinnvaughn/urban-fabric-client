import { InfoIcon, KeyboardIcon, Minus, Plus } from "lucide-react"
import { Box, Menu } from "#/features/ui"
import { css, cx } from "#/styles/styled-system/css"
import { useMap } from "../fabric-map"

const controlButton = css({
	width: "34px",
	height: "34px",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	border: "none",
	background: { base: "transparent", _hover: "stone.100" },
	color: { base: "stone.600", _hover: "stone.900" },
	cursor: "pointer",
	transition:
		"background 150ms var(--easings-in-out), color 150ms var(--easings-in-out)",
	flexShrink: 0,
})

export function MapControls() {
	const map = useMap()

	return (
		<Box
			className={css({
				justifySelf: "start",
				pointerEvents: "all",
				display: "flex",
				alignItems: "center",
				borderRadius: "md",
				overflow: "hidden",
				background: "white",
			})}
		>
			<button
				type="button"
				className={controlButton}
				title="Zoom out"
				onClick={() => map.zoomOut()}
			>
				<Minus size={12} />
			</button>
			<div
				className={css({
					width: "px",
					height: "4",
					background: "stone.200",
					flexShrink: 0,
				})}
			/>
			<button
				type="button"
				className={controlButton}
				title="Zoom in"
				onClick={() => map.zoomIn()}
			>
				<Plus size={12} />
			</button>
			<div
				className={css({
					width: "px",
					height: "4",
					background: "stone.200",
					flexShrink: 0,
				})}
			/>
			<Menu>
				<Menu.Trigger>
					<button
						type="button"
						className={cx(
							controlButton,
							css({ fontSize: "xs", fontWeight: "bold" }),
						)}
						title="Help & documentation"
					>
						?
					</button>
				</Menu.Trigger>
				<Menu.Content>
					<Menu.Item
						icon={<KeyboardIcon size={14} />}
						kbd="⇧ ?"
						// onClick={onOpenShortcuts}
					>
						Keyboard shortcuts
					</Menu.Item>

					<Menu.Item
						icon={<InfoIcon size={14} />}
						// onClick={onOpenToolRef}
					>
						Tool reference
					</Menu.Item>
				</Menu.Content>
			</Menu>
		</Box>
	)
}
