import type { ElementCategory, LineLayerStyle } from "./types"

export const BIKING_CATEGORY: ElementCategory = {
	id: "biking",
	title: "Biking",
	elements: [
		{
			id: "bike-lane",
			title: "Bike Lane",
			description:
				"A dedicated lane on the road for cyclists, separated from vehicle traffic by markings or barriers.",
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
				drawPreview: {
					color: "#78ab3c",
					width: 3,
					opacity: 0.5,
					dasharray: [8, 6],
					lineCap: "round",
				},

				lineSymbol: {
					src: "/icons/elements/bike-lane.svg",
					spacing: 200,
					size: 32,
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
					key: "lanes",
					label: "Lanes Per Side",
					default: "1",
					input: {
						kind: "segmented",
						options: [
							{ label: "1 lane", value: "1" },
							{ label: "2 lanes", value: "2" },
						],
					},
					toMapStyle: () => ({}),
				},
				{
					key: "sides",
					label: "Sides of Street",
					default: "one",
					input: {
						kind: "segmented",
						options: [
							{ label: "1 side", value: "one" },
							{ label: "2 sides", value: "both" },
						],
					},
					toMapStyle: () => ({}),
				},
				{
					key: "width",
					label: "Width",
					default: 5,
					input: {
						kind: "slider",
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
							white: "#fdfdf7",
						}
						const color = paintColors[value as string]
						if (!color) return {}
						const casingOpacity: Record<string, number> = {
							green: 0.18,
							red: 0.45,
							blue: 0.45,
							white: 0.65,
						}
						return {
							"line-color": color,
							"line-casing-opacity": casingOpacity[value as string] ?? 0.18,
						}
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
			description:
				"A marked lane where cyclists and cars share the same road space, indicated by painted arrow symbols.",
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
				drawPreview: {
					color: "#78ab3c",
					width: 2.5,
					opacity: 0.45,
					dasharray: [6, 5],
					lineCap: "round",
				},

				lineSymbol: {
					src: "/icons/elements/sharrow.svg",
					spacing: 200,
					size: 32,
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "shared-with",
					label: "Shared With",
					description: "Which types of users share this lane",
					default: "bike-car",
					input: {
						kind: "segmented",
						options: [
							{
								label: "Bike + Car",
								value: "bike-car",
								description: "Cyclists and general vehicle traffic share the lane",
							},
							{
								label: "Bike + Bus",
								value: "bike-bus",
								description: "Cyclists and buses share a transit corridor",
							},
						],
					},
					toMapStyle: () => ({}),
				},
			],

			calculated: [
				{ key: "length", label: "Length", unit: "ft" },
				{ key: "from", label: "From" },
				{ key: "to", label: "To" },
			],
		},
	],
}
