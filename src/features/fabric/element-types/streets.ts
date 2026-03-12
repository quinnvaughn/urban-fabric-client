import type { ElementCategory } from "./types"

export const STREETS_CATEGORY: ElementCategory = {
	id: "streets",
	title: "Streets",
	elements: [
		{
			id: "bike-lane",
			title: "Bike Lane",
			geometry: "line",
			draw: "click-to-place-points",
			baseMapStyle: {
				color: "#3d8b37",
				width: 4,
			},
			properties: [
				{
					key: "protection",
					label: "Protection Level",
					default: "none",
					input: {
						kind: "segmented",
						options: [
							{ label: "None", value: "none" },
							{ label: "Flexible", value: "flexible" },
							{ label: "Rigid", value: "rigid" },
						],
					},
					toMapStyle: (value) => {
						if (value === "none") return { "line-dasharray": [6, 2] }
						if (value === "flexible") return {}
						if (value === "rigid") return { "line-width": 6 }
						return {}
					},
				},
				{
					key: "direction",
					label: "Direction",
					default: "two-way",
					input: {
						kind: "segmented",
						options: [
							{ label: "Two-way", value: "two-way" },
							{ label: "With", value: "one-way-with" },
							{ label: "Against", value: "one-way-against" },
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
					toMapStyle: () => ({}),
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
					default: "none",
					input: {
						kind: "select",
						options: [
							{ label: "None", value: "none" },
							{ label: "Green fill", value: "green" },
							{ label: "Red fill", value: "red" },
							{ label: "Blue fill", value: "blue" },
							{ label: "White stripe only", value: "white" },
						],
					},
					toMapStyle: (value) => {
						const paintColors: Record<string, string> = {
							green: "#4a9e44",
							red: "#c0392b",
							blue: "#2980b9",
							white: "#ffffff",
						}
						return value !== "none" && paintColors[value as string]
							? { "line-color": paintColors[value as string] }
							: {}
					},
				},
			],
			// Calculated fields — derived at render time, not stored as user input
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
			baseMapStyle: {
				color: "#78ab3c",
				width: 3,
				dasharray: [4, 2],
			},
			properties: [],
			calculated: [
				{ key: "length", label: "Length", unit: "ft" },
				{ key: "from", label: "From" },
				{ key: "to", label: "To" },
			],
		},
	],
}
