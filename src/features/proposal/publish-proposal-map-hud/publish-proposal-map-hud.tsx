import { RotateCcw } from "lucide-react"
import { MapControls, useMap } from "#/features/fabric"
import { Attribution } from "#/features/fabric/attribution"
import { Box } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Viewport = {
	center: [number, number]
	zoom: number
}

type Props = {
	fabricViewport: Viewport
	currentViewport: Viewport
	is3DMode?: boolean
	onToggle3DMode?: () => void
}

export function PublishProposalMapHud({
	fabricViewport,
	currentViewport,
	is3DMode,
	onToggle3DMode,
}: Props) {
	const map = useMap()
	const isResetDisabled =
		currentViewport.center[0] === fabricViewport.center[0] &&
		currentViewport.center[1] === fabricViewport.center[1] &&
		currentViewport.zoom === fabricViewport.zoom

	return (
		<Box
			className={css({
				position: "absolute",
				bottom: "20px",
				left: "20px",
				right: "20px",
				zIndex: "panel",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "end",
			})}
		>
			<Attribution />
			<button
				disabled={isResetDisabled}
				type="button"
				className={css({
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: "1.5",
					py: "2",
					px: "3",
					border: "1px solid",
					borderColor: "stone.200",
					borderRadius: "md",
					boxShadow: "sm",
					background: "white",
					color: "stone.600",
					fontSize: "xs",
					fontWeight: "medium",
					cursor: "pointer",
					transition:
						"background 150ms var(--easings-in-out), color 150ms var(--easings-in-out)",
					flexShrink: 0,
					"&:not(:disabled):hover": {
						background: "stone.100",
						color: "stone.900",
					},
					_disabled: {
						background: "stone.100",
						color: "stone.400",
						boxShadow: "none",
						cursor: "not-allowed",
						opacity: "100",
					},
				})}
				onClick={() => {
					map.flyTo({
						center: fabricViewport.center,
						zoom: fabricViewport.zoom,
						duration: 700,
					})
				}}
			>
				<RotateCcw size={12} />
				<span>Reset to fabric view</span>
			</button>
			<MapControls
				showHelp={false}
				is3DMode={is3DMode}
				onToggle3DMode={onToggle3DMode}
			/>
		</Box>
	)
}
