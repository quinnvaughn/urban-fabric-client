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
							white: "#fdfdf7",
						}
						const color = paintColors[value as string]
						if (!color) return {}
						const casingOpacity: Record<string, number> = {
							green: 0.18, // same as the base default
							red: 0.45, // red casing helps anchor the red line
							blue: 0.45,
							white: 0.65, // needs the most help
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
			} satisfies LineLayerStyle,

			properties: [],

			calculated: [
				{ key: "length", label: "Length", unit: "ft" },
				{ key: "from", label: "From" },
				{ key: "to", label: "To" },
			],
		},
		// Add to STREETS_CATEGORY.elements, after sharrow:

		{
			id: "bus-lane",
			title: "Dedicated Bus Lane",
			geometry: "line",
			draw: "click-to-place-points",
			excludes: [],
			baseMapStyle: {
				color: "#d4901e",
				width: 5,
				lineCap: "square",
				lineJoin: "round",

				casingWidth: 11,
				casingOpacity: 0.16,

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
					color: "#d4901e",
					width: 3,
					opacity: 0.5,
					dasharray: [8, 6],
					lineCap: "round",
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "direction",
					label: "Direction",
					description: "Which direction buses travel in this lane",
					default: "one-way-with",
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
					key: "transit-only",
					label: "Transit Only",
					description:
						"Whether the lane is restricted to buses only or shared with other vehicles during off-peak hours",
					default: "exclusive",
					input: {
						kind: "segmented",
						options: [
							{
								label: "Exclusive",
								value: "exclusive",
								description: "Buses only at all times",
							},
							{
								label: "Peak-only",
								value: "peak-only",
								description: "Bus-only during rush hours",
							},
						],
					},
					toMapStyle: (value) => {
						if (value === "peak-only") return { "line-dasharray": [8, 3] }
						return { "line-dasharray": [1, 0] }
					},
				},
				{
					key: "width",
					label: "Width",
					default: 11,
					input: {
						kind: "stepper",
						min: 10,
						max: 16,
						step: 0.5,
						unit: "ft",
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

		{
			id: "pedestrian-street",
			title: "Pedestrian / Shared Street",
			geometry: "line",
			draw: "click-to-place-points",
			excludes: [],
			baseMapStyle: {
				color: "#b95846",
				width: 6,
				lineCap: "square",
				lineJoin: "round",

				casingWidth: 13,
				casingOpacity: 0.14,

				selected: {
					width: 7.5,
					lineCap: "round",
					outlineOpacity: 0.8,
					outlineDasharray: [5, 3],
					outlineOffset: 11,
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
					color: "#b95846",
					width: 3,
					opacity: 0.5,
					dasharray: [8, 6],
					lineCap: "round",
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "access",
					label: "Vehicle Access",
					description: "What vehicle access is permitted on the shared street",
					default: "none",
					input: {
						kind: "segmented",
						options: [
							{ label: "None", value: "none", description: "Pedestrians only" },
							{
								label: "Access only",
								value: "access-only",
								description: "Local access and deliveries only",
							},
							{
								label: "Shared",
								value: "shared",
								description: "Vehicles permitted, pedestrians have priority",
							},
						],
					},
					toMapStyle: (value) => {
						if (value === "none") return { "line-dasharray": [1, 0] }
						if (value === "access-only") return { "line-dasharray": [10, 3] }
						if (value === "shared") return { "line-dasharray": [6, 3] }
						return {}
					},
				},
				{
					key: "surface",
					label: "Surface Material",
					default: "pavers",
					input: {
						kind: "select",
						options: [
							{ label: "Pavers", value: "pavers" },
							{ label: "Asphalt", value: "asphalt" },
							{ label: "Concrete", value: "concrete" },
							{ label: "Gravel", value: "gravel" },
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

		{
			id: "parking-removal",
			title: "Parking Removal",
			geometry: "line",
			draw: "click-to-place-points",
			excludes: [],
			baseMapStyle: {
				color: "#8a857d",
				width: 4,
				lineCap: "square",
				lineJoin: "round",
				dasharray: [3, 3],

				casingWidth: 10,
				casingOpacity: 0.12,

				selected: {
					width: 5.5,
					lineCap: "round",
					outlineOpacity: 0.75,
					outlineDasharray: [5, 3],
					outlineOffset: 9,
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
					color: "#8a857d",
					width: 2.5,
					opacity: 0.45,
					dasharray: [6, 5],
					lineCap: "round",
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "side",
					label: "Side of Street",
					description: "Which curb lane is being converted",
					default: "both",
					input: {
						kind: "segmented",
						options: [
							{ label: "Both", value: "both" },
							{ label: "Left", value: "left" },
							{ label: "Right", value: "right" },
						],
					},
					toMapStyle: () => ({}),
				},
				{
					key: "repurpose",
					label: "Repurposed As",
					description: "What the reclaimed curb space becomes",
					default: "unspecified",
					input: {
						kind: "select",
						options: [
							{ label: "Unspecified / TBD", value: "unspecified" },
							{ label: "Bike lane", value: "bike-lane" },
							{ label: "Bus lane", value: "bus-lane" },
							{ label: "Parklet / seating", value: "parklet" },
							{ label: "Wider sidewalk", value: "sidewalk" },
							{ label: "Loading zone", value: "loading" },
							{ label: "Travel lane", value: "travel-lane" },
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

		{
			id: "lane-reduction",
			title: "Lane Reduction / Road Diet",
			geometry: "line",
			draw: "click-to-place-points",
			excludes: [],
			baseMapStyle: {
				color: "#504c45",
				width: 5,
				lineCap: "square",
				lineJoin: "round",

				casingWidth: 12,
				casingOpacity: 0.15,

				selected: {
					width: 6.5,
					lineCap: "round",
					outlineOpacity: 0.8,
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
					color: "#504c45",
					width: 3,
					opacity: 0.5,
					dasharray: [8, 6],
					lineCap: "round",
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "lanes-before",
					label: "Lanes Before",
					default: 4,
					input: { kind: "stepper", min: 2, max: 8, step: 1, unit: "lanes" },
					constraints: [
						{ kind: "min-sibling", sibling: "lanes-after", offset: 1 },
					],
					toMapStyle: () => ({}),
				},
				{
					key: "lanes-after",
					label: "Lanes After",
					default: 2,
					input: { kind: "stepper", min: 1, max: 7, step: 1, unit: "lanes" },
					constraints: [
						{ kind: "max-sibling", sibling: "lanes-before", offset: 1 },
					],
					toMapStyle: () => ({}),
				},
			],

			calculated: [
				{ key: "lanes-removed", label: "Lanes Removed" },
				{ key: "length", label: "Length", unit: "ft" },
				{ key: "from", label: "From" },
				{ key: "to", label: "To" },
			],
		},
		{
			id: "sidewalk-widening",
			title: "Sidewalk Widening",
			geometry: "line",
			draw: "click-to-place-points",
			excludes: [],
			baseMapStyle: {
				color: "#7c6fb0",
				width: 4,
				lineCap: "square",
				lineJoin: "round",

				casingWidth: 10,
				casingOpacity: 0.15,

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
					color: "#7c6fb0",
					width: 3,
					opacity: 0.5,
					dasharray: [8, 6],
					lineCap: "round",
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "width-before",
					label: "Current Width",
					default: 6,
					input: {
						kind: "stepper",
						min: 2,
						max: 30,
						step: 0.5,
						unit: "ft",
					},
					toMapStyle: () => ({}),
				},
				{
					key: "width-after",
					label: "Proposed Width",
					default: 12,
					input: {
						kind: "stepper",
						min: 2,
						max: 30,
						step: 0.5,
						unit: "ft",
					},
					constraints: [
						{ kind: "min-sibling", sibling: "width-before", offset: 0 },
					],
					toMapStyle: () => ({}),
				},
			],

			calculated: [
				{ key: "width-gained", label: "Width Gained", unit: "ft" },
				{ key: "length", label: "Length", unit: "ft" },
				{ key: "from", label: "From" },
				{ key: "to", label: "To" },
			],
		},
		{
			id: "new-sidewalk",
			title: "New Sidewalk",
			geometry: "line",
			draw: "click-to-place-points",
			excludes: [],
			baseMapStyle: {
				color: "#a070b8",
				width: 4,
				lineCap: "square",
				lineJoin: "round",

				casingWidth: 10,
				casingOpacity: 0.15,

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
					color: "#a070b8",
					width: 3,
					opacity: 0.5,
					dasharray: [8, 6],
					lineCap: "round",
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "width",
					label: "Width",
					default: 8,
					input: {
						kind: "stepper",
						min: 3,
						max: 30,
						step: 0.5,
						unit: "ft",
					},
					toMapStyle: () => ({}),
				},
				{
					key: "side",
					label: "Side of Street",
					description: "Which side of the street the new sidewalk is on",
					default: "both",
					input: {
						kind: "segmented",
						options: [
							{ label: "Both", value: "both" },
							{ label: "Left", value: "left" },
							{ label: "Right", value: "right" },
						],
					},
					toMapStyle: () => ({}),
				},
				{
					key: "surface",
					label: "Surface Material",
					default: "concrete",
					input: {
						kind: "select",
						options: [
							{ label: "Concrete", value: "concrete" },
							{ label: "Asphalt", value: "asphalt" },
							{ label: "Pavers", value: "pavers" },
							{ label: "Gravel", value: "gravel" },
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
