import type { AreaLayerStyle, ElementCategory } from "./types"

export const INTERSECTIONS_CATEGORY: ElementCategory = {
	id: "intersections",
	title: "Intersections",
	elements: [
		{
			id: "curb-extension",
			title: "Curb Extension",
			description:
				"An expanded curb area that shortens crossings and slows turning vehicles.",
			geometry: "area",
			draw: "single-click-area",
			placement: "single-click",
			areaShape: "curb-extension",
			areaPlacement: {
				anchor: "click",
				requireStreet: false,
			},
			drawingConstraints: {
				lockPerpendicularToStreet: {
					searchRadiusPx: 36,
				},
			},
			excludes: [],
			baseMapStyle: {
				color: "#b95846",
				opacity: 0.74,
				outlineColor: "#7f3328",
				outlineWidth: 2,
				outlineOpacity: 0.95,

				selected: {
					opacity: 0.84,
					outlineColor: "#7f3328",
					outlineOpacity: 1,
					outlineWidth: 3,
				},

				drawPreview: {
					color: "#b95846",
					opacity: 0.65,
					outlineColor: "#7f3328",
					outlineWidth: 2,
				},
				lineSymbol: {
					src: "/icons/elements/curb-extension.svg",
					placement: "point",
					size: 24,
				},
			} satisfies AreaLayerStyle,

			properties: [
				{
					key: "use",
					label: "Use",
					description: "What the curb extension is mainly meant to improve",
					default: "crossing",
					input: {
						kind: "segmented",
						options: [
							{
								label: "Crossing",
								value: "crossing",
								description: "Shortens the distance people need to cross",
							},
							{
								label: "Corner",
								value: "corner",
								description: "Slows turning vehicles at the corner",
							},
							{
								label: "Bus stop",
								value: "bus-stop",
								description: "Creates more waiting space at a stop",
							},
						],
					},
					toMapStyle: () => ({}),
				},
				{
					key: "length",
					label: "Extension Length",
					default: 32,
					input: {
						kind: "slider",
						min: 12,
						max: 80,
						step: 1,
						unit: "ft",
					},
					toMapStyle: () => ({}),
				},
				{
					key: "width",
					label: "Extension Width",
					default: 10,
					input: {
						kind: "slider",
						min: 4,
						max: 24,
						step: 0.5,
						unit: "ft",
					},
					toMapStyle: () => ({}),
				},
				{
					key: "bearing",
					label: "Rotation",
					default: 0,
					input: {
						kind: "slider",
						min: 0,
						max: 359,
						step: 15,
						unit: "deg",
					},
					toMapStyle: () => ({}),
				},
				{
					key: "surface",
					label: "Surface",
					default: "concrete",
					input: {
						kind: "select",
						options: [
							{ label: "Concrete", value: "concrete" },
							{ label: "Painted", value: "painted" },
							{ label: "Planters", value: "planters" },
						],
					},
					toMapStyle: () => ({}),
				},
			],

			calculated: [{ key: "from", label: "Location" }],
		},
		{
			id: "median-refuge-island",
			title: "Pedestrian Refuge Island",
			description:
				"A protected island where people can pause while crossing a wide or busy street.",
			geometry: "area",
			draw: "single-click-area",
			placement: "single-click",
			areaShape: "capsule",
			areaPlacement: {
				anchor: "street-center",
			},
			drawingConstraints: {
				lockPerpendicularToStreet: {
					searchRadiusPx: 32,
				},
			},
			excludes: [],
			baseMapStyle: {
				color: "#d48a1f",
				opacity: 0.72,
				outlineColor: "#7a4a12",
				outlineWidth: 2,
				outlineOpacity: 0.95,

				selected: {
					opacity: 0.82,
					outlineColor: "#7a4a12",
					outlineOpacity: 1,
					outlineWidth: 3,
				},

				drawPreview: {
					color: "#d48a1f",
					opacity: 0.65,
					outlineColor: "#7a4a12",
					outlineWidth: 2,
				},
				lineSymbol: {
					src: "/icons/elements/median-refuge-island.svg",
					placement: "point",
					size: 24,
				},
			} satisfies AreaLayerStyle,

			properties: [
				{
					key: "islandType",
					label: "Island Type",
					description: "The kind of refuge island being added",
					default: "pedestrian",
					input: {
						kind: "segmented",
						options: [
							{
								label: "Pedestrian",
								value: "pedestrian",
								description: "A refuge for people walking across the street",
							},
							{
								label: "Bike/ped",
								value: "bike-ped",
								description: "A wider refuge for walking and biking crossings",
							},
							{
								label: "Median nose",
								value: "median-nose",
								description:
									"A short median extension that protects the crossing",
							},
						],
					},
					toMapStyle: (value) => {
						if (value === "bike-ped") {
							return {
								"line-width": 22,
								"line-casing-opacity": 0.22,
							}
						}
						if (value === "median-nose") {
							return {
								"line-width": 14,
								"line-casing-opacity": 0.18,
							}
						}
						return { "line-width": 18 }
					},
				},
				{
					key: "length",
					label: "Island Length",
					default: 28,
					input: {
						kind: "slider",
						min: 12,
						max: 80,
						step: 1,
						unit: "ft",
					},
					toMapStyle: () => ({}),
				},
				{
					key: "width",
					label: "Island Width",
					default: 8,
					input: {
						kind: "slider",
						min: 4,
						max: 16,
						step: 0.5,
						unit: "ft",
					},
					toMapStyle: () => ({}),
				},
				{
					key: "bearing",
					label: "Rotation",
					default: 0,
					input: {
						kind: "slider",
						min: 0,
						max: 359,
						step: 15,
						unit: "deg",
					},
					toMapStyle: () => ({}),
				},
				{
					key: "surface",
					label: "Surface",
					default: "concrete",
					input: {
						kind: "select",
						options: [
							{ label: "Concrete", value: "concrete" },
							{ label: "Painted", value: "painted" },
							{ label: "Landscaped", value: "landscaped" },
						],
					},
					toMapStyle: () => ({}),
				},
			],

			calculated: [{ key: "from", label: "Location" }],
		},
	],
}
