import type { StyleSpecification } from "maplibre-gl"

type CanvasStyleOptions = {
	dev?: boolean
}

export function makeCanvasStyle(
	baseUrl: string,
	opts: CanvasStyleOptions = {},
): StyleSpecification {
	const suffix = opts.dev ? "_quick" : ""

	const style: StyleSpecification = {
		version: 8,
		name: "Urban Fabric Editor",
		light: {
			anchor: "viewport",
			intensity: 0.8,
			color: "#ffffff",
			position: [1.15, 210, 30],
		},
			sources: {
				roads: {
					type: "vector",
					tiles: [`${baseUrl}/roads_driving${suffix}/{z}/{x}/{y}.pbf`],
				},
				bike: {
					type: "vector",
					tiles: [`${baseUrl}/bike_lanes${suffix}/{z}/{x}/{y}.pbf`],
				},
				sidewalks: {
					type: "vector",
					tiles: [`${baseUrl}/sidewalks${suffix}/{z}/{x}/{y}.pbf`],
				},
				buildings: {
					type: "vector",
					tiles: [`${baseUrl}/buildings${suffix}/{z}/{x}/{y}.pbf`],
				},
			},
		layers: [],
	}

	const layers: any[] = []

	// Background
	layers.push({
		id: "background",
		type: "background",
		paint: { "background-color": "#f5f5f5" },
	})

	// Major roads only at low zooms
	layers.push({
		id: "roads-major",
		type: "line",
		source: "roads",
		"source-layer": "driving",
		maxzoom: 12,
		filter: [
			"in",
			["get", "highway"],
			[
				"literal",
				[
					"motorway",
					"motorway_link",
					"trunk",
					"trunk_link",
					"primary",
					"primary_link",
				],
			],
		],
		paint: {
			"line-color": "#b0b0b0",
			"line-width": ["interpolate", ["linear"], ["zoom"], 5, 1, 11, 2],
			"line-opacity": 0.9,
		},
		layout: { "line-join": "round", "line-cap": "round" },
	})

	// Full road hierarchy starting a bit higher
	layers.push({
		id: "roads-full",
		type: "line",
		source: "roads",
		"source-layer": "driving",
		minzoom: 12,
		paint: {
			"line-color": [
				"match",
				["get", "highway"],
				["motorway", "motorway_link", "trunk", "trunk_link"],
				"#9e9e9e",
				["primary", "primary_link"],
				"#b0b0b0",
				["secondary", "secondary_link"],
				"#c0c0c0",
				["tertiary", "tertiary_link"],
				"#d0d0d0",
				"#e0e0e0",
			],
			"line-width": ["step", ["zoom"], 1, 14, 3, 17, 5],
			"line-opacity": 0.9,
		},
		layout: { "line-join": "round", "line-cap": "round" },
	})

	// Building footprint (flat) from zoom 13
	layers.push({
		id: "building-fill",
		type: "fill",
		source: "buildings",
		"source-layer": "buildings",
		minzoom: 13,
		paint: {
			"fill-color": "#e0e0e0",
			"fill-opacity": [
				"interpolate",
				["linear"],
				["zoom"],
				13,
				0.1,
				14,
				0.3,
				15,
				0.4,
			],
			"fill-outline-color": "#b0b0b0",
		},
	})
	layers.push({
		id: "building-stroke",
		type: "line",
		source: "buildings",
		"source-layer": "buildings",
		minzoom: 13,
		paint: {
			"line-color": "#999999",
			"line-width": 1,
			"line-opacity": 0.7,
		},
	})

	// Bike lanes delayed until 14
	layers.push({
		id: "bike-protected",
		type: "line",
		source: "bike",
		"source-layer": "bike_lanes",
		filter: ["==", ["get", "bike_type"], "protected"],
		minzoom: 14,
		paint: {
			"line-color": "#27ae60",
			"line-width": 3,
		},
		layout: { "line-join": "round", "line-cap": "round" },
	})
	layers.push({
		id: "bike-designated",
		type: "line",
		source: "bike",
		"source-layer": "bike_lanes",
		filter: ["==", ["get", "bike_type"], "designated"],
		minzoom: 14,
		paint: {
			"line-color": "#3498db",
			"line-width": 2,
			"line-dasharray": [3, 3],
		},
		layout: { "line-join": "round", "line-cap": "round" },
	})
	layers.push({
		id: "bike-painted",
		type: "line",
		source: "bike",
		"source-layer": "bike_lanes",
		filter: ["==", ["get", "bike_type"], "painted"],
		minzoom: 14,
		paint: {
			"line-color": "#8e44ad",
			"line-width": 2,
			"line-dasharray": [2, 2],
		},
		layout: { "line-join": "round", "line-cap": "round" },
	})
	layers.push({
		id: "bike-sharrow",
		type: "line",
		source: "bike",
		"source-layer": "bike_lanes",
		filter: ["==", ["get", "bike_type"], "sharrow"],
		minzoom: 14,
		paint: {
			"line-color": "#f39c12",
			"line-width": 2,
			"line-dasharray": [1, 2],
		},
		layout: { "line-join": "round", "line-cap": "round" },
	})

	// Sidewalks only very zoomed-in
	layers.push({
		id: "sidewalks",
		type: "line",
		source: "sidewalks",
		"source-layer": "sidewalks",
		minzoom: 16,
		paint: {
			"line-color": "#999999",
			"line-width": ["interpolate", ["linear"], ["zoom"], 16, 1, 18, 2.5],
			"line-dasharray": [2, 2],
			"line-opacity": 0.9,
		},
		layout: { "line-join": "round", "line-cap": "round" },
	})

	// Extrusion last, starting at 14
	layers.push({
		id: "building-extrusion",
		type: "fill-extrusion",
		source: "buildings",
		"source-layer": "buildings",
		minzoom: 14,
		paint: {
			"fill-extrusion-color": "#d3d3d3",
			"fill-extrusion-height": [
				"coalesce",
				["get", "inferred_height"],
				["to-number", ["get", "height"]],
				0,
			],
			"fill-extrusion-base": 0,
			"fill-extrusion-opacity": 0.9,
			"fill-extrusion-vertical-gradient": true,
		},
	})

	style.layers = layers
	return style
}
