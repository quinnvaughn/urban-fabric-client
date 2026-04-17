import type { ElementCategory, LineLayerStyle } from "./types"

export const WALKING_CATEGORY: ElementCategory = {
	id: "walking",
	title: "Walking",
	elements: [
		{
			id: "pedestrian-crossing",
			title: "Pedestrian Crossing",
			description: "Click once on a street to place a pedestrian crossing.",
			geometry: "line",
			draw: "single-segment-perpendicular",
			placement: "single-click",
			drawingConstraints: {
				lockPerpendicularToStreet: {
					searchRadiusPx: 24,
				},
			},
			excludes: [],
			baseMapStyle: {
				color: "#00a9ff",
				width: 10,
				lineCap: "butt",
				lineJoin: "round",
				dasharray: [1.2, 0.8],

				casingWidth: 14,
				casingOpacity: 0.24,

				selected: {
					width: 11.5,
					lineCap: "round",
					outlineOpacity: 0.85,
					outlineDasharray: [4, 3],
					outlineOffset: 12,
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
					color: "#00a9ff",
					width: 6,
					opacity: 0.75,
					dasharray: [1.2, 0.8],
					lineCap: "butt",
				},
				lineSymbol: {
					src: "/icons/elements/pedestrian-crossing.svg",
					placement: "line-center",
					size: 32,
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "marking",
					label: "Marking Type",
					description: "How the crossing is striped on the street",
					default: "continental",
					input: {
						kind: "segmented",
						options: [
							{
								label: "Continental",
								value: "continental",
								description: "Bold ladder-style bars",
							},
							{
								label: "Standard",
								value: "standard",
								description: "Conventional painted crossing",
							},
							{
								label: "Raised",
								value: "raised",
								description: "Crossing is elevated to sidewalk level",
							},
						],
					},
					toMapStyle: (value) => {
						if (value === "standard") {
							return {
								"line-dasharray": [0.6, 0.8],
								"line-width": 8,
							}
						}
						if (value === "raised") {
							return {
								"line-dasharray": [1.8, 0.4],
								"line-width": 12,
								"line-casing-opacity": 0.28,
							}
						}
						return {
							"line-dasharray": [1.2, 0.8],
							"line-width": 10,
						}
					},
				},
				{
					key: "lighting",
					label: "Lighting",
					description:
						"Extra lighting focused on the crossing to improve nighttime visibility.",
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
					key: "width",
					label: "Crossing Width",
					default: 12,
					input: {
						kind: "slider",
						min: 6,
						max: 24,
						step: 1,
						unit: "ft",
					},
					toMapStyle: (value) => {
						const width = typeof value === "number" ? value : Number(value)
						if (!Number.isFinite(width)) return {}
						return { "line-width": width }
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
			id: "pedestrian-street",
			title: "Pedestrian Street",
			description:
				"A street corridor redesigned to prioritize people walking, with limited or no car access.",
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

				lineSymbol: {
					src: "/icons/elements/pedestrian-street.svg",
					spacing: 200,
					size: 32,
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
			id: "sidewalk-widening",
			title: "Sidewalk Widening",
			description:
				"Expanding an existing sidewalk to give people more room to walk, especially in busy areas.",
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
				lineSymbol: {
					src: "/icons/elements/sidewalk-widening.svg",
					spacing: 200,
					size: 32,
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "width-before",
					label: "Current Width",
					default: 6,
					input: {
						kind: "slider",
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
						kind: "slider",
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
				{
					key: "at-expense-of",
					label: "At the Expense Of",
					description:
						"What is giving up space to make room for the wider sidewalk",
					input: {
						kind: "select",
						options: [
							{ label: "Parking Lane", value: "parking-lane" },
							{ label: "Travel Lane", value: "travel-lane" },
							{ label: "Planting Strip / Buffer", value: "planting-strip" },
							{ label: "Median / Center Turn Lane", value: "median" },
						],
					},
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
			description:
				"Adding a brand new sidewalk on a street that currently has none, so people have a safe place to walk.",
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
				lineSymbol: {
					src: "/icons/elements/new-sidewalk.svg",
					spacing: 200,
					size: 32,
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "width",
					label: "Width",
					default: 8,
					input: {
						kind: "slider",
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
