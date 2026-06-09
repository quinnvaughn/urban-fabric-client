import type { AreaLayerStyle, ElementCategory, PointLayerStyle } from "./types"

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
					showInProposal: false,
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
			id: "daylighting",
			title: "Daylighting",
			description:
				"Keeps the space near a corner free of parked cars so people can see and be seen.",
			geometry: "area",
			draw: "single-click-area",
			placement: "single-click",
			areaShape: "rectangle",
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
				color: "#e8c54a",
				opacity: 0.68,
				outlineColor: "#8a6a16",
				outlineWidth: 2,
				outlineOpacity: 0.95,

				selected: {
					opacity: 0.78,
					outlineColor: "#8a6a16",
					outlineOpacity: 1,
					outlineWidth: 3,
				},

				drawPreview: {
					color: "#e8c54a",
					opacity: 0.58,
					outlineColor: "#8a6a16",
					outlineWidth: 2,
				},
				lineSymbol: {
					src: "/icons/elements/clear-corner.svg",
					placement: "point",
					size: 24,
				},
			} satisfies AreaLayerStyle,

			properties: [
				{
					key: "treatment",
					label: "Treatment",
					description: "How the corner is kept clear",
					default: "paint",
					input: {
						kind: "segmented",
						options: [
							{
								label: "Paint",
								value: "paint",
								description: "Painted no-parking area",
							},
							{
								label: "Posts",
								value: "posts",
								description: "Posts or bollards keep vehicles out",
							},
							{
								label: "Planters",
								value: "planters",
								description: "Planters define the clear space",
							},
						],
					},
					toMapStyle: () => ({}),
				},
				{
					key: "length",
					label: "Clear Length",
					default: 30,
					input: {
						kind: "slider",
						min: 10,
						max: 80,
						step: 1,
						unit: "ft",
					},
					toMapStyle: () => ({}),
				},
				{
					key: "width",
					label: "Clear Width",
					default: 8,
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
					showInProposal: false,
					input: {
						kind: "slider",
						min: 0,
						max: 359,
						step: 15,
						unit: "deg",
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
					showInProposal: false,
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
		{
			id: "roundabout",
			title: "Roundabout",
			description:
				"A circular intersection design that slows traffic and keeps vehicles moving.",
			geometry: "area",
			draw: "single-click-area",
			placement: "single-click",
			areaShape: "circle",
			areaPlacement: {
				anchor: "click",
				requireStreet: false,
			},
			excludes: [],
			baseMapStyle: {
				color: "#8a8f63",
				opacity: 0.76,
				outlineColor: "#4f5336",
				outlineWidth: 2,
				outlineOpacity: 0.95,

				selected: {
					opacity: 0.86,
					outlineColor: "#4f5336",
					outlineOpacity: 1,
					outlineWidth: 3,
				},

				drawPreview: {
					color: "#8a8f63",
					opacity: 0.65,
					outlineColor: "#4f5336",
					outlineWidth: 2,
				},
				lineSymbol: {
					src: "/icons/elements/roundabout.svg",
					placement: "point",
					size: 24,
				},
			} satisfies AreaLayerStyle,

			properties: [
				{
					key: "diameter",
					label: "Diameter",
					default: 36,
					input: {
						kind: "slider",
						min: 12,
						max: 120,
						step: 2,
						unit: "ft",
					},
					toMapStyle: () => ({}),
				},
				{
					key: "type",
					label: "Type",
					default: "raised",
					input: {
						kind: "segmented",
						options: [
							{
								label: "Raised",
								value: "raised",
								description: "A built circular island",
							},
							{
								label: "Painted",
								value: "painted",
								description: "Painted circle with no raised island",
							},
							{
								label: "Planted",
								value: "planted",
								description: "Center island with landscaping",
							},
						],
					},
					toMapStyle: () => ({}),
				},
			],

			calculated: [{ key: "from", label: "Location" }],
		},
		{
			id: "stop-sign",
			title: "Stop Sign",
			description: "A stop sign placed on an approach to an intersection.",
			geometry: "point",
			draw: "single-click-point",
			placement: "single-click",
			excludes: [],
			baseMapStyle: {
				color: "#d62828",
				lineSymbol: {
					src: "/icons/elements/stop-sign.svg",
					placement: "point",
					size: 28,
				},
			} satisfies PointLayerStyle,

			properties: [
				{
					key: "action",
					label: "Action",
					default: "add",
					input: {
						kind: "segmented",
						options: [
							{ label: "Add", value: "add" },
							{ label: "Remove", value: "remove" },
							{ label: "Existing", value: "existing" },
						],
					},
					toMapStyle: () => ({}),
				},
				{
					key: "approach",
					label: "Approach",
					default: "unspecified",
					input: {
						kind: "select",
						options: [
							{ label: "Unspecified", value: "unspecified" },
							{ label: "Northbound", value: "northbound" },
							{ label: "Southbound", value: "southbound" },
							{ label: "Eastbound", value: "eastbound" },
							{ label: "Westbound", value: "westbound" },
						],
					},
					toMapStyle: () => ({}),
				},
			],

			calculated: [{ key: "from", label: "Location" }],
		},
		{
			id: "traffic-signal",
			title: "Traffic Signal",
			description: "A signalized intersection or proposed intersection signal.",
			geometry: "point",
			draw: "single-click-point",
			placement: "single-click",
			excludes: [],
			baseMapStyle: {
				color: "#2d5d8f",
				lineSymbol: {
					src: "/icons/elements/traffic-signal.svg",
					placement: "point",
					size: 28,
				},
			} satisfies PointLayerStyle,

			properties: [
				{
					key: "action",
					label: "Action",
					default: "add",
					input: {
						kind: "segmented",
						options: [
							{ label: "Add", value: "add" },
							{ label: "Upgrade", value: "upgrade" },
							{ label: "Retiming", value: "retiming" },
						],
					},
					toMapStyle: () => ({}),
				},
				{
					key: "signal-type",
					label: "Signal Type",
					default: "standard",
					input: {
						kind: "segmented",
						options: [
							{ label: "Standard", value: "standard" },
							{ label: "Pedestrian", value: "pedestrian" },
							{ label: "Bike", value: "bike" },
						],
					},
					toMapStyle: () => ({}),
				},
				{
					key: "accessible-signals",
					label: "Accessible Signals",
					default: "no",
					input: {
						kind: "segmented",
						options: [
							{ label: "No", value: "no" },
							{ label: "Yes", value: "yes" },
						],
					},
					toMapStyle: () => ({}),
				},
			],

			calculated: [{ key: "from", label: "Location" }],
		},
		{
			id: "yield-sign",
			title: "Yield Sign",
			description: "A yield sign placed on an approach to an intersection.",
			geometry: "point",
			draw: "single-click-point",
			placement: "single-click",
			excludes: [],
			baseMapStyle: {
				color: "#d62828",
				lineSymbol: {
					src: "/icons/elements/yield-sign.svg",
					placement: "point",
					size: 34,
				},
			} satisfies PointLayerStyle,

			properties: [
				{
					key: "action",
					label: "Action",
					default: "add",
					input: {
						kind: "segmented",
						options: [
							{ label: "Add", value: "add" },
							{ label: "Remove", value: "remove" },
							{ label: "Existing", value: "existing" },
						],
					},
					toMapStyle: () => ({}),
				},
				{
					key: "approach",
					label: "Approach",
					default: "unspecified",
					input: {
						kind: "select",
						options: [
							{ label: "Unspecified", value: "unspecified" },
							{ label: "Northbound", value: "northbound" },
							{ label: "Southbound", value: "southbound" },
							{ label: "Eastbound", value: "eastbound" },
							{ label: "Westbound", value: "westbound" },
						],
					},
					toMapStyle: () => ({}),
				},
			],

			calculated: [{ key: "from", label: "Location" }],
		},
	],
}
