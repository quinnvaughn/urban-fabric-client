import { Compass, Minus, Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Box } from "#/features/ui"
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
	const [bearing, setBearing] = useState(() => map.getBearing())
	const dragRef = useRef<{ startX: number; startBearing: number } | null>(null)

	useEffect(() => {
		function onRotate() {
			setBearing(map.getBearing())
		}
		map.on("rotate", onRotate)
		return () => {
			map.off("rotate", onRotate)
		}
	}, [map])

	function onMouseDown(e: React.MouseEvent) {
		e.preventDefault()
		dragRef.current = { startX: e.clientX, startBearing: map.getBearing() }

		function onMouseMove(e: MouseEvent) {
			if (!dragRef.current) return
			const delta = e.clientX - dragRef.current.startX
			map.setBearing(dragRef.current.startBearing + delta * 0.5)
		}

		function onMouseUp(e: MouseEvent) {
			const moved = Math.abs(e.clientX - (dragRef.current?.startX ?? e.clientX))
			dragRef.current = null
			window.removeEventListener("mousemove", onMouseMove)
			window.removeEventListener("mouseup", onMouseUp)
			// Treat as click-to-reset if barely moved
			if (moved < 4) map.resetNorth()
		}

		window.addEventListener("mousemove", onMouseMove)
		window.addEventListener("mouseup", onMouseUp)
	}

	return (
		<Box
			className={css({
				justifySelf: "start",
				pointerEvents: "all",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				borderRadius: "md",
				overflow: "hidden",
				background: "white",
			})}
		>
			<button
				type="button"
				className={controlButton}
				title="Zoom in"
				onClick={() => map.zoomIn()}
			>
				<Plus size={12} />
			</button>
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
					width: "4",
					height: "px",
					background: "stone.200",
					flexShrink: 0,
				})}
			/>
			<button
				type="button"
				className={cx(controlButton, css({ cursor: "ew-resize" }))}
				title="Drag to rotate · Click to reset north"
				onMouseDown={onMouseDown}
			>
				<Compass
					size={12}
					style={{
						transform: `rotate(${-bearing}deg)`,
						transition: bearing === 0 ? "transform 300ms ease-out" : "none",
					}}
				/>
			</button>
		</Box>
	)
}
