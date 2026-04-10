import type { ElementCategory, LineLayerStyle } from "./types"

const BASE_ENDPOINTS = {
	radius: 5.5,
	fillColor: "#ffffff",
	strokeWidth: 2,
	glowRadius: 9,
	glowOpacity: 0.12,
	snapRingRadius: 13,
	snapRingOpacity: 0.45,
	snapRingDasharray: [3, 2] as [number, number],
	snapRingWidth: 1.5,
}

const DIRECTION_PROPERTY = {
	key: "direction",
	label: "Direction",
	description: "Which direction trains run on this segment",
	default: "one-way",
	input: {
		kind: "segmented" as const,
		options: [
			{ label: "One-way", value: "one-way" },
			{ label: "Two-way", value: "two-way" },
		],
	},
	// Arrow rendering for one-way is handled by the elements layer
	toMapStyle: () => ({}),
}

export const TRANSIT_CATEGORY: ElementCategory = {
	id: "transit",
	title: "Transit",
	elements: [
		{
			id: "tram",
			title: "Tram",
			description:
				"A tram line running in or alongside street traffic. Snaps to the road network.",
			geometry: "line",
			draw: "click-to-place-points",
			excludes: [],
			baseMapStyle: {
				color: "#e8b84b",
				width: 5,
				lineCap: "butt",
				lineJoin: "round",
				dasharray: [8, 3],

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

				endpoints: BASE_ENDPOINTS,

				drawPreview: {
					color: "#e8b84b",
					width: 3,
					opacity: 0.5,
					dasharray: [8, 6],
					lineCap: "round",
				},

				lineSymbol: {
					src: "/icons/elements/tram.svg",
					spacing: 200,
					size: 32,
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "configuration",
					label: "Configuration",
					description: "How the tracks relate to street traffic",
					default: "street-running",
					input: {
						kind: "segmented",
						options: [
							{
								label: "Street-running",
								value: "street-running",
								description: "Mixed with traffic in the road",
							},
							{
								label: "Dedicated lane",
								value: "dedicated-lane",
								description: "Own lane within the street, separated from traffic",
							},
						],
					},
					toMapStyle: (value) => {
						if (value === "street-running") return { "line-dasharray": [8, 3] }
						if (value === "dedicated-lane") return { "line-dasharray": [1, 0] }
						return {}
					},
				},
				DIRECTION_PROPERTY,
			],

			calculated: [
				{ key: "length", label: "Length", unit: "ft" },
				{ key: "from", label: "From" },
				{ key: "to", label: "To" },
			],
		},
		{
			id: "light-rail",
			title: "Light Rail (LRT)",
			description:
				"A light rail line in its own dedicated corridor, separate from road traffic.",
			geometry: "line",
			draw: "straight-line-points",
			excludes: [],
			baseMapStyle: {
				color: "#2563eb",
				width: 5,
				lineCap: "butt",
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

				endpoints: BASE_ENDPOINTS,

				drawPreview: {
					color: "#2563eb",
					width: 3,
					opacity: 0.5,
					dasharray: [8, 6],
					lineCap: "round",
				},

				lineSymbol: {
					src: "/icons/elements/light-rail.svg",
					spacing: 200,
					size: 32,
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "configuration",
					label: "Configuration",
					description: "Physical relationship to the surrounding environment",
					default: "dedicated",
					input: {
						kind: "segmented",
						options: [
							{
								label: "Dedicated corridor",
								value: "dedicated",
								description: "At-grade in its own right-of-way, separate from roads",
							},
							{
								label: "Grade-separated",
								value: "grade-separated",
								description: "Elevated structure or tunnel",
							},
						],
					},
					toMapStyle: (value) => {
						if (value === "dedicated") return {}
						if (value === "grade-separated") return { "line-dasharray": [12, 2] }
						return {}
					},
				},
				DIRECTION_PROPERTY,
			],

			calculated: [
				{ key: "length", label: "Length", unit: "ft" },
				{ key: "from", label: "From" },
				{ key: "to", label: "To" },
			],
		},
	],
}
