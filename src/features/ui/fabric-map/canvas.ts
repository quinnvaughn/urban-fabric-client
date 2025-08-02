import type { StyleSpecification } from "mapbox-gl"

export const canvasStyle: StyleSpecification = {
	version: 8,
	name: "Urban Fabric Canvas",
	sources: {
		mapbox: {
			type: "vector",
			url: "mapbox://mapbox.mapbox-streets-v8",
		},
	},
	sprite: "mapbox://sprites/mapbox/streets-v8",
	glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
	layers: [
		// Background
		{
			id: "background",
			type: "background",
			paint: { "background-color": "#f8f9fa" },
		},
		// Water
		{
			id: "water",
			type: "fill",
			source: "mapbox",
			"source-layer": "water",
			paint: { "fill-color": "#d6eaff" },
		},
		// Landuse (parks, industrial, airports, institutional)
		{
			id: "landuse",
			type: "fill",
			source: "mapbox",
			"source-layer": "landuse",
			paint: {
				"fill-color": [
					"match",
					["get", "class"],
					"park",
					"#d6f5d6",
					"airport",
					"#f0f5fa",
					"industrial",
					"#f6ecd9",
					"institutional",
					"#f0f0f7",
					/* other */ "rgba(0,0,0,0)", // fully transparent
				],
				"fill-opacity": 0.8,
			},
		},
		// Road fill (white)
		{
			id: "roads-fill",
			type: "line",
			source: "mapbox",
			"source-layer": "road",
			filter: [
				"all",
				["!", ["in", ["get", "class"], ["literal", ["path", "pedestrian"]]]],
				[">=", ["zoom"], 12],
			],
			paint: {
				"line-color": "#ffffff",
				"line-width": [
					"interpolate",
					["exponential", 1.8],
					["zoom"],
					12,
					[
						"match",
						["get", "class"],
						"motorway",
						4,
						"primary",
						3,
						"secondary",
						2,
						"street",
						0,
						"service",
						0,
						0,
					],
					16,
					[
						"match",
						["get", "class"],
						"motorway",
						24,
						"primary",
						20,
						"secondary",
						16,
						"street",
						12,
						"service",
						8,
						6,
					],
					20,
					[
						"match",
						["get", "class"],
						"motorway",
						300,
						"primary",
						200,
						"secondary",
						150,
						"street",
						120,
						"service",
						80,
						60,
					],
				],
				"line-opacity": 1,
			},
			layout: { "line-join": "round", "line-cap": "butt" },
		},
		// Sidewalks / pedestrian paths
		// Sidewalk outline
		{
			id: "pedestrian-sidewalks-outline",
			type: "line",
			source: "mapbox",
			"source-layer": "road",
			filter: [
				"all",
				["in", ["get", "class"], ["literal", ["path", "pedestrian"]]],
				[">=", ["zoom"], 15],
			],
			paint: {
				"line-color": "#b0b0b0", // darker edge
				"line-width": [
					"interpolate",
					["exponential", 1.8],
					["zoom"],
					15,
					8,
					20,
					34,
				],
				"line-opacity": 1,
			},
			layout: { "line-join": "round", "line-cap": "butt" },
		},
		// Sidewalk fill
		{
			id: "pedestrian-sidewalks",
			type: "line",
			source: "mapbox",
			"source-layer": "road",
			filter: [
				"all",
				["in", ["get", "class"], ["literal", ["path", "pedestrian"]]],
				[">=", ["zoom"], 15],
			],
			paint: {
				"line-color": "#d9d9d9", // lighter interior
				"line-width": [
					"interpolate",
					["exponential", 1.8],
					["zoom"],
					15,
					6,
					20,
					16, // was 30
				],
				"line-opacity": 1,
			},
			layout: { "line-join": "round", "line-cap": "butt" },
		},
		// Road labels
		{
			id: "road-labels",
			type: "symbol",
			source: "mapbox",
			"source-layer": "road",
			layout: {
				"text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
				"text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
				"text-size": [
					"interpolate",
					["linear"],
					["zoom"],
					12,
					10,
					16,
					14,
					20,
					20,
				],
				"symbol-placement": "line",
				"text-pitch-alignment": "viewport",
				"text-rotation-alignment": "map",
				"text-allow-overlap": false,
			},
			paint: {
				"text-color": "#666",
				"text-halo-color": "#f8f9fa",
				"text-halo-width": 1,
			},
			minzoom: 12,
		},
		// Buildings
		{
			id: "buildings",
			type: "fill",
			source: "mapbox",
			"source-layer": "building",
			paint: {
				"fill-color": "#e0e0e0",
				"fill-outline-color": "#c0c0c0",
				"fill-opacity": 0.9,
			},
		},
		// Admin boundaries
		{
			id: "admin-boundaries",
			type: "line",
			source: "mapbox",
			"source-layer": "admin",
			paint: {
				"line-color": "#bbbbbb",
				"line-width": 1,
				"line-dasharray": [3, 3],
				"line-opacity": 0.5,
			},
		},
		// place labels
		{
			id: "place-labels",
			type: "symbol",
			source: "mapbox",
			"source-layer": "place_label",
			layout: {
				"text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
				"text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
				"text-size": [
					"interpolate",
					["linear"],
					["zoom"],
					4,
					10,
					10,
					14,
					16,
					18,
				],
				"text-allow-overlap": false,
				"text-ignore-placement": false,
			},
			paint: {
				"text-color": "#555",
				"text-halo-color": "#ffffff",
				"text-halo-width": 1.2,
			},
			minzoom: 4,
		},
		{
			id: "water-labels",
			type: "symbol",
			source: "mapbox",
			"source-layer": "water_label",
			layout: {
				"text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
				"text-font": ["Open Sans Italic", "Arial Unicode MS Regular"],
				"text-size": ["interpolate", ["linear"], ["zoom"], 8, 10, 16, 16],
				"symbol-placement": "point",
			},
			paint: {
				"text-color": "#5a8bd8",
				"text-halo-color": "#ffffff",
				"text-halo-width": 1,
			},
			minzoom: 8,
		},
		// point of interest labels
		{
			id: "poi-labels",
			type: "symbol",
			source: "mapbox",
			"source-layer": "poi_label",
			layout: {
				"text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
				"text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
				"text-size": ["interpolate", ["linear"], ["zoom"], 14, 10, 20, 16],
				"text-allow-overlap": false,
			},
			paint: {
				"text-color": "#444",
				"text-halo-color": "#ffffff",
				"text-halo-width": 1,
			},
			minzoom: 14,
		},
		{
			id: "road-centerline-hitbox",
			type: "line",
			source: "mapbox",
			"source-layer": "road",
			paint: { "line-width": 10, "line-opacity": 0 },
			layout: { "line-join": "round", "line-cap": "round" },
		},
	],
}
