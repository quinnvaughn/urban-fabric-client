import type { ElementCategory, LineLayerStyle } from "./types"

export const TRANSIT_CATEGORY: ElementCategory = {
	id: "transit",
	title: "Transit",
	elements: [
		{
			id: "light-rail",
			title: "Light Rail / Streetcar",
			description:
				"A light rail or streetcar line. Can run in a dedicated corridor or embedded in an existing street.",
			geometry: "line",
			draw: "straight-line-points",
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
					color: "#e8b84b",
					width: 3,
					opacity: 0.5,
					dasharray: [8, 6],
					lineCap: "round",
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "configuration",
					label: "Configuration",
					description: "How the tracks relate to the surrounding road environment",
					default: "street-running",
					input: {
						kind: "segmented",
						options: [
							{
								label: "Street-running",
								value: "street-running",
								description: "Tracks run in the street, mixed with or alongside traffic",
							},
							{
								label: "Dedicated",
								value: "dedicated",
								description: "Tracks in their own surface corridor, separated from traffic",
							},
							{
								label: "Grade-separated",
								value: "grade-separated",
								description: "Tracks on elevated structure or in tunnel",
							},
						],
					},
					toMapStyle: (value) => {
						if (value === "street-running") return { "line-dasharray": [8, 3] }
						if (value === "dedicated") return { "line-dasharray": [1, 0] }
						if (value === "grade-separated") return { "line-dasharray": [12, 2] }
						return {}
					},
				},
				{
					key: "direction",
					label: "Direction",
					description: "Which direction trains run on this segment",
					default: "one-way",
					input: {
						kind: "segmented",
						options: [
							{ label: "Two-way", value: "two-way" },
							{ label: "One-way", value: "one-way" },
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
