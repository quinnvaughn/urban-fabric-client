import maplibregl from "maplibre-gl"
import { css } from "#/styles/styled-system/css"

const pulseRing = css({
	position: "absolute",
	top: "-7px",
	left: "50%",
	width: "34px",
	height: "34px",
	borderRadius: "full",
	borderWidth: "3px",
	borderStyle: "solid",
	borderColor: "brand.default",
	background: "transparent",
	transform: "translateX(-50%)",
	transformOrigin: "center",
	animation: "comment-pin-pulse 1.6s ease-out infinite",
	pointerEvents: "none",
	opacity: 0.75,
	zIndex: 0,
})

const markerRoot = css({
	position: "relative",
	overflow: "visible",
})

const pulseStyle = `
@keyframes comment-pin-pulse {
	0% {
		transform: translateX(-50%) scale(0.95);
		opacity: 0.75;
	}
	70% {
		transform: translateX(-50%) scale(2.4);
		opacity: 0;
	}
	100% {
		transform: translateX(-50%) scale(2.4);
		opacity: 0;
	}
}
`

type Options = {
	pulse?: boolean
	scale?: number
}

export function createProposalCommentLocationMarker({
	pulse = false,
	scale = 1,
}: Options = {}) {
	const baseMarker = new maplibregl.Marker({
		color: "var(--colors-brand-default)",
		scale,
	})
	const markerElement = baseMarker.getElement()
	markerElement.className = `${markerElement.className} ${markerRoot}`

	if (pulse) {
		const styleElement = document.createElement("style")
		styleElement.textContent = pulseStyle

		const ringElement = document.createElement("div")
		ringElement.className = pulseRing

		markerElement.append(styleElement, ringElement)
	}

	return new maplibregl.Marker({
		element: markerElement,
		anchor: "bottom",
	})
}
