import type { ElementCategory, LineLayerStyle } from "./types"

export const TRAILS_AND_PATHS_CATEGORY: ElementCategory = {
	id: "trails-and-paths",
	title: "Trails & Paths",
	elements: [
		{
			id: "shared-use-path",
			title: "Shared-Use Path",
			description:
				"A path designed for people walking, biking, rolling, and using other mobility devices, usually on an independent alignment.",
			geometry: "line",
			draw: "straight-line-points",
			excludes: [],
			baseMapStyle: {
				color: "#2f8f83",
				width: 5,
				lineCap: "round",
				lineJoin: "round",

				casingWidth: 11,
				casingOpacity: 0.18,

				selected: {
					width: 6.5,
					lineCap: "round",
					outlineOpacity: 0.85,
					outlineDasharray: [5, 3],
					outlineOffset: 10,
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
					color: "#2f8f83",
					width: 3,
					opacity: 0.55,
					dasharray: [7, 5],
					lineCap: "round",
				},

				lineSymbol: {
					src: "/icons/elements/shared-use-path.svg",
					spacing: 200,
					size: 32,
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "width",
					label: "Width",
					default: 10,
					input: {
						kind: "slider",
						min: 6,
						max: 30,
						step: 0.5,
						unit: "ft",
					},
					toMapStyle: (value) => {
						const width = typeof value === "number" ? value : Number(value)
						if (!Number.isFinite(width)) return {}
						return { "line-width": width / 2 }
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
							{ label: "Gravel", value: "gravel" },
							{ label: "Boardwalk", value: "boardwalk" },
						],
					},
					toMapStyle: (value) => {
						if (value === "gravel") return { "line-dasharray": [5, 2] }
						if (value === "boardwalk") return { "line-dasharray": [3, 1] }
						return { "line-dasharray": [1, 0] }
					},
				},
				{
					key: "lighting",
					label: "Lighting",
					default: "none",
					input: {
						kind: "segmented",
						options: [
							{ label: "None", value: "none" },
							{ label: "Added", value: "added" },
						],
					},
					toMapStyle: () => ({}),
				},
				{
					key: "grade",
					label: "Grade",
					default: "at-grade",
					input: {
						kind: "segmented",
						options: [
							{ label: "At grade", value: "at-grade" },
							{ label: "Elevated", value: "elevated" },
							{ label: "Below grade", value: "below-grade" },
						],
					},
					toMapStyle: (value) => {
						if (value === "elevated") return { "line-casing-opacity": 0.28 }
						if (value === "below-grade") return { "line-dasharray": [5, 2] }
						return {}
					},
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
