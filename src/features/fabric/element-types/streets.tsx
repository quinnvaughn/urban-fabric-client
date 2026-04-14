import type { ElementCategory, LineLayerStyle } from "./types"

export const STREETS_CATEGORY: ElementCategory = {
	id: "streets",
	title: "Streets",
	elements: [
		{
			id: "street-parking-removal",
			title: "Street Parking Removal",
			description:
				"Removing on-street parking spaces along a curb to free up space for other uses like bike lanes, wider sidewalks, or seating.",
			geometry: "line",
			draw: "click-to-place-points",
			excludes: [],
			baseMapStyle: {
				color: "#e0436a",
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
					color: "#e0436a",
					width: 2.5,
					opacity: 0.45,
					dasharray: [6, 5],
					lineCap: "round",
				},

				lineSymbol: {
					src: "/icons/elements/street-parking-removal.svg",
					spacing: 200,
					size: 32,
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
			description:
				"Reducing the number of car lanes on a street to slow traffic and free up space for people walking, biking, or transit.",
			geometry: "line",
			draw: "click-to-place-points",
			excludes: [],
			baseMapStyle: {
				color: "#0ea5b0",
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
					color: "#0ea5b0",
					width: 3,
					opacity: 0.5,
					dasharray: [8, 6],
					lineCap: "round",
				},
				lineSymbol: {
					src: "/icons/elements/lane-reduction.svg",
					spacing: 200,
					size: 32,
				},
			} satisfies LineLayerStyle,

			properties: [
				{
					key: "lanes-before",
					label: "Lanes Before",
					default: 4,
					input: { kind: "slider", min: 2, max: 8, step: 1, unit: "lanes" },
					toMapStyle: () => ({}),
				},
				{
					key: "lanes-after",
					label: "Lanes After",
					default: 2,
					input: { kind: "slider", min: 1, max: 7, step: 1, unit: "lanes" },
					constraints: [
						{ kind: "max-sibling", sibling: "lanes-before", offset: 1 },
					],
					toMapStyle: () => ({}),
				},
				{
					key: "reclaimed-as",
					label: "Reclaimed As",
					description: "What the removed lane space becomes",
					input: {
						kind: "select",
						options: [
							{ label: "Wider Sidewalk", value: "sidewalk" },
							{ label: "Bike Lane", value: "bike-lane" },
							{ label: "Bus Lane", value: "bus-lane" },
							{ label: "Median / Planting Strip", value: "median" },
							{ label: "Parking Lane", value: "parking-lane" },
						],
					},
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
	],
}
