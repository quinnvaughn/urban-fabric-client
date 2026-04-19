import { InfoIcon, KeyboardIcon, LocateFixed, Minus, Plus } from "lucide-react"
import {
	getFabricShortcutHint,
	MAP_CONTROL_SHORTCUT_IDS,
	useFabricKeyboardShortcuts,
} from "#/features/fabric/keyboard-shortcuts"
import { Box, Menu, Tooltip, useToast } from "#/features/ui"
import { useModalStore } from "#/stores"
import { css, cva, cx } from "#/styles/styled-system/css"
import { useMap } from "../fabric-map"

const controlButton = cva({
	base: {
		width: "40px",
		height: "40px",
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
		"& [data-cuboid-face='top']": {
			fill: "white",
		},
		"& [data-cuboid-face='front']": {
			fill: "stone.100",
		},
		"& [data-cuboid-face='side']": {
			fill: "stone.200",
		},
		_pressed: {
			background: "transparent",
			color: "brand.emphasis",
			"& [data-cuboid-face='top']": {
				fill: "brand.subtle",
			},
			"& [data-cuboid-face='front']": {
				fill: "brand.default",
			},
			"& [data-cuboid-face='side']": {
				fill: "brand.muted",
			},
			_hover: {
				background: "stone.100",
				color: "brand.emphasis",
			},
		},
	},
})

type Props = {
	showHelp?: boolean
	showGetCurrentLocation?: boolean
	show3DMode?: boolean
	is3DMode?: boolean
	onToggle3DMode?: () => void
}

function CuboidIcon() {
	return (
		<svg
			aria-hidden="true"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
		>
			<path
				data-cuboid-face="top"
				d="M5 8.5 12 4l7 4.5-7 4.5L5 8.5Z"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.6"
			/>
			<path
				data-cuboid-face="front"
				d="M5 8.5v7L12 20v-7L5 8.5Z"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.6"
			/>
			<path
				data-cuboid-face="side"
				d="M19 8.5v7L12 20v-7l7-4.5Z"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.6"
			/>
		</svg>
	)
}

export function MapControls({
	showHelp = true,
	showGetCurrentLocation = true,
	show3DMode = true,
	is3DMode = false,
	onToggle3DMode,
}: Props) {
	const map = useMap()
	const { open } = useModalStore()
	const toast = useToast()

	const handleGetLocation = () => {
		if (!("geolocation" in navigator)) {
			toast.error("Unable to get location", {
				description: "Geolocation is not supported by this browser.",
			})
			return
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { longitude, latitude } = position.coords
				map.flyTo({
					center: [longitude, latitude],
					zoom: Math.max(map.getZoom(), 16),
					duration: 700,
				})
			},
			(error) => {
				const description =
					error.code === error.PERMISSION_DENIED
						? "Location access was denied. Please enable it in your browser settings."
						: error.code === error.POSITION_UNAVAILABLE
							? "Your location is currently unavailable."
							: "Timed out while trying to get your location."

				toast.error("Unable to get location", { description })
			},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
		)
	}

	useFabricKeyboardShortcuts({
		ids: MAP_CONTROL_SHORTCUT_IDS,
		deps: {
			zoomIn: () => map.zoomIn(),
			zoomOut: () => map.zoomOut(),
			openShortcuts: () => open("shortcuts"),
		},
	})

	return (
		<Box
			className={css({
				justifySelf: "start",
				pointerEvents: "all",
				display: "flex",
				alignItems: "center",
				border: "1px solid",
				borderColor: "stone.200",
				borderRadius: "md",
				boxShadow: "sm",
				overflow: "hidden",
				background: "white",
			})}
		>
			{showGetCurrentLocation && (
				<Tooltip placement="top-end">
					<Tooltip.Trigger>
						<button
							type="button"
							className={controlButton()}
							onClick={handleGetLocation}
						>
							<LocateFixed size={20} />
						</button>
					</Tooltip.Trigger>
					<Tooltip.Content>Get current location</Tooltip.Content>
				</Tooltip>
			)}
			{showGetCurrentLocation && (
				<div
					className={css({
						width: "px",
						height: "4",
						background: "stone.200",
						flexShrink: 0,
					})}
				/>
			)}
			<Tooltip placement="top-end">
				<Tooltip.Trigger>
					<button
						type="button"
						className={controlButton()}
						onClick={() => map.zoomOut()}
					>
						<Minus size={20} />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content>Zoom out</Tooltip.Content>
			</Tooltip>
			<div
				className={css({
					width: "px",
					height: "4",
					background: "stone.200",
					flexShrink: 0,
				})}
			/>
			<Tooltip placement="top-end">
				<Tooltip.Trigger>
					<button
						type="button"
						className={controlButton()}
						onClick={() => map.zoomIn()}
					>
						<Plus size={20} />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content>Zoom in</Tooltip.Content>
			</Tooltip>
			{show3DMode && onToggle3DMode && (
				<>
					<div
						className={css({
							width: "px",
							height: "4",
							background: "stone.200",
							flexShrink: 0,
						})}
					/>
					<Tooltip placement="top-end">
						<Tooltip.Trigger>
							<button
								type="button"
								aria-pressed={is3DMode}
								className={controlButton()}
								onClick={onToggle3DMode}
							>
								<CuboidIcon />
							</button>
						</Tooltip.Trigger>
						<Tooltip.Content>
							{is3DMode ? "Hide 3D" : "Show 3D"}
						</Tooltip.Content>
					</Tooltip>
				</>
			)}
			{showHelp && (
				<div
					className={css({
						width: "px",
						height: "4",
						background: "stone.200",
						flexShrink: 0,
					})}
				/>
			)}
			{showHelp && (
				<Menu>
					<Tooltip placement="top-end">
						<Tooltip.Trigger>
							<Menu.Trigger>
								<button
									type="button"
									className={cx(
										controlButton(),
										css({ fontSize: "20px", fontWeight: "semibold" }),
									)}
								>
									?
								</button>
							</Menu.Trigger>
						</Tooltip.Trigger>
						<Tooltip.Content>Help & documentation</Tooltip.Content>
					</Tooltip>
					<Menu.Content>
						<Menu.Item
							icon={<KeyboardIcon size={14} />}
							kbd={getFabricShortcutHint("openShortcuts")}
							onClick={() => open("shortcuts")}
						>
							Keyboard shortcuts
						</Menu.Item>
						<Menu.Item
							icon={<InfoIcon size={14} />}
							onClick={() => open("toolRef")}
						>
							Tool reference
						</Menu.Item>
					</Menu.Content>
				</Menu>
			)}
		</Box>
	)
}
