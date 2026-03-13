import { ArrowLeft, ArrowLeftRight, ArrowRight } from "lucide-react"
import type { ElementCategory, LineLayerStyle } from "./types"

// ─── Category ─────────────────────────────────────────────────────────────────

export const STREETS_CATEGORY: ElementCategory = {
	id: "streets",
	title: "Streets",
	elements: [
		{
			id: "bike-lane",
			title: "Bike Lane",
			geometry: "line",
			draw: "click-to-place-points",
			excludes: ["sharrow"],
			baseMapStyle: {
				color: "#3d8b37",
				width: 4,
				lineCap: "square",
				lineJoin: "round",

				casingWidth: 10,
				casingOpacity: 0.18,

				selected: {
					width: 5.5,
					lineCap: "round",
					outlineOpacity: 0.85,
					outlineDasharray: [5, 3],
					outlineOffset: 9,
					outlineWidth: 1.5,
				},

				endpoints: {
					radius: 5.5,
					fillColor: "#ffffff",
					strokeWidth: 2,
					glowRadius: 9,
					glowOpacity: 0.12,
					snapRingRadius: 13,
					snapRingOpacity: 0.45,
					snapRingDasharray: [3, 2],
					snapRingWidth: 1.5,
				},
				midHandle: {
					width: 12,
					height: 10,
					radius: 2.5,
					fillColor: "#ffffff",
					strokeWidth: 1.5,
				},
				drawPreview: {
					color: "#78ab3c",
					width: 3,
					opacity: 0.5,
					dasharray: [8, 6],
					lineCap: "round",
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "protection",
					label: "Protection Level",
					description:
						"How physically separated the lane is from vehicle traffic",
					default: "none",
					input: {
						kind: "segmented",
						options: [
							{
								label: "None",
								value: "none",
								description: "Lane markings only, no physical barrier",
							},
							{
								label: "Flexible",
								value: "flexible",
								description: "Soft barriers like flex posts or delineators",
							},
							{
								label: "Rigid",
								value: "rigid",
								description: "Hard barriers like concrete curbs or planters",
							},
						],
					},
					toMapStyle: (value) => {
						if (value === "none") return { "line-dasharray": [2, 2] }
						if (value === "flexible") return { "line-dasharray": [6, 2] }
						if (value === "rigid") return { "line-dasharray": [1, 0] }
						return {}
					},
				},
				{
					key: "direction",
					label: "Direction",
					description: "Which direction cyclists travel in this lane",
					default: "two-way",
					input: {
						kind: "segmented",
						options: [
							{
								label: "Two-way",
								value: "two-way",
								icon: <ArrowLeftRight size={14} />,
							},
							{
								label: "With",
								value: "one-way-with",
								icon: <ArrowRight size={14} />,
							},
							{
								label: "Against",
								value: "one-way-against",
								icon: <ArrowLeft size={14} />,
							},
						],
					},
					toMapStyle: () => ({}),
				},
				{
					key: "width",
					label: "Width",
					default: 5,
					input: {
						kind: "stepper",
						min: 3,
						max: 20,
						step: 0.5,
						unit: "ft",
					},
					toMapStyle: (value) => {
						const width = typeof value === "number" ? value : Number(value)
						if (!Number.isFinite(width)) return {}
						return { "line-width": width }
					},
				},
				{
					key: "surface",
					label: "Surface Material",
					default: "asphalt",
					input: {
						kind: "select",
						options: [
							{ label: "Asphalt", value: "asphalt" },
							{ label: "Concrete", value: "concrete" },
							{ label: "Pavers", value: "pavers" },
							{ label: "Gravel", value: "gravel" },
						],
					},
					toMapStyle: () => ({}),
				},
				{
					key: "paint",
					label: "Paint",
					default: "green",
					input: {
						kind: "select",
						options: [
							{ label: "Green fill", value: "green" },
							{ label: "Red fill", value: "red" },
							{ label: "Blue fill", value: "blue" },
							{ label: "White stripe only", value: "white" },
						],
					},
					toMapStyle: (value) => {
						const paintColors: Record<string, string> = {
							green: "#3d8b37",
							red: "#c0392b",
							blue: "#2980b9",
							white: "#ffffff",
						}
						const color = paintColors[value as string]
						return color ? { "line-color": color } : {}
					},
				},
			],

			calculated: [
				{ key: "length", label: "Length", unit: "ft" },
				{ key: "from", label: "From" },
				{ key: "to", label: "To" },
			],
		},

		{
			id: "sharrow",
			title: "Sharrow/Shared Lane",
			geometry: "line",
			draw: "click-to-place-points",
			excludes: ["bike-lane"],
			baseMapStyle: {
				color: "#78ab3c",
				width: 3,
				lineCap: "round",
				lineJoin: "round",
				dasharray: [4, 2],

				casingWidth: 8,
				casingOpacity: 0.14,

				selected: {
					width: 4.5,
					lineCap: "round",
					outlineOpacity: 0.75,
					outlineDasharray: [5, 3],
					outlineOffset: 8,
					outlineWidth: 1.5,
				},

				endpoints: {
					radius: 5,
					fillColor: "#ffffff",
					strokeWidth: 2,
					glowRadius: 8,
					glowOpacity: 0.12,
					snapRingRadius: 12,
					snapRingOpacity: 0.4,
					snapRingDasharray: [3, 2],
					snapRingWidth: 1.5,
				},
				midHandle: {
					width: 11,
					height: 9,
					radius: 2.5,
					fillColor: "#ffffff",
					strokeWidth: 1.5,
				},
				drawPreview: {
					color: "#78ab3c",
					width: 2.5,
					opacity: 0.45,
					dasharray: [6, 5],
					lineCap: "round",
				},
			} satisfies LineLayerStyle,

			properties: [],

			calculated: [
				{ key: "length", label: "Length", unit: "ft" },
				{ key: "from", label: "From" },
				{ key: "to", label: "To" },
			],
		},
	],
}
