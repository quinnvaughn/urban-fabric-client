import { InfoIcon, KeyboardIcon, LocateFixed, Minus, Plus } from "lucide-react"
import {
	getFabricShortcutHint,
	MAP_CONTROL_SHORTCUT_IDS,
	useFabricKeyboardShortcuts,
} from "#/features/fabric/keyboard-shortcuts"
import { Box, Menu, Tooltip, useToast } from "#/features/ui"
import { useModalStore } from "#/stores"
import { css, cx } from "#/styles/styled-system/css"
import { useMap } from "../fabric-map"

const controlButton = css({
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
})

type Props = {
	showHelp?: boolean
	showGetCurrentLocation?: boolean
}

export function MapControls({
	showHelp = true,
	showGetCurrentLocation = true,
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
							className={controlButton}
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
						className={controlButton}
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
						className={controlButton}
						onClick={() => map.zoomIn()}
					>
						<Plus size={20} />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content>Zoom in</Tooltip.Content>
			</Tooltip>
			<div
				className={css({
					width: "px",
					height: "4",
					background: "stone.200",
					flexShrink: 0,
				})}
			/>
			{showHelp && (
				<Menu>
					<Menu.Trigger>
						<Tooltip placement="top-end">
							<Tooltip.Trigger>
								<button
									type="button"
									className={cx(
										controlButton,
										css({ fontSize: "20px", fontWeight: "semibold" }),
									)}
								>
									?
								</button>
							</Tooltip.Trigger>
							<Tooltip.Content>Help & documentation</Tooltip.Content>
						</Tooltip>
					</Menu.Trigger>
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
