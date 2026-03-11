import type { StyleSpecification } from "maplibre-gl"

export function buildMapStyle(apiKey: string): StyleSpecification {
	return {
		version: 8,
		glyphs:
			"https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
		sprite: "https://protomaps.github.io/basemaps-assets/sprites/v4/light",
		sources: {
			protomaps: {
				type: "vector",
				url: `https://api.protomaps.com/tiles/v4.json?key=${apiKey}`,
				attribution:
					'<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
			},
		},
		layers: [
			// ── Background ────────────────────────────────────────────────
			{
				id: "background",
				type: "background",
				paint: { "background-color": "#e8e2d9" },
			},
			{
				id: "earth",
				type: "fill",
				source: "protomaps",
				"source-layer": "earth",
				paint: { "fill-color": "#e8e2d9" },
			},

			// ── Water ─────────────────────────────────────────────────────
			{
				id: "water",
				type: "fill",
				source: "protomaps",
				"source-layer": "water",
				filter: [
					"all",
					[
						"in",
						["get", "kind"],
						[
							"literal",
							["ocean", "sea", "lake", "river", "reservoir", "canal"],
						],
					],
				],
				paint: { "fill-color": "#b8cfe0" },
			},

			// ── Landcover (low zoom forests/grassland) ────────────────────
			{
				id: "landcover-grass",
				type: "fill",
				source: "protomaps",
				"source-layer": "landcover",
				filter: ["in", ["get", "kind"], ["literal", ["grassland", "farmland"]]],
				paint: { "fill-color": "#ddd8c8", "fill-opacity": 0.5 },
			},
			{
				id: "landcover-forest",
				type: "fill",
				source: "protomaps",
				"source-layer": "landcover",
				filter: ["==", ["get", "kind"], "forest"],
				paint: { "fill-color": "#c0d4b0", "fill-opacity": 0.6 },
			},

			// ── Landuse ───────────────────────────────────────────────────
			// Green spaces — the most important to be visible
			{
				id: "landuse-park",
				type: "fill",
				source: "protomaps",
				"source-layer": "landuse",
				filter: [
					"in",
					["get", "kind"],
					[
						"literal",
						[
							"park",
							"garden",
							"dog_park",
							"recreation_ground",
							"playground",
							"pitch",
							"grass",
							"meadow",
						],
					],
				],
				paint: { "fill-color": "#b8d4a8" },
			},
			{
				id: "landuse-nature",
				type: "fill",
				source: "protomaps",
				"source-layer": "landuse",
				filter: [
					"in",
					["get", "kind"],
					[
						"literal",
						[
							"nature_reserve",
							"national_park",
							"protected_area",
							"wood",
							"forest",
						],
					],
				],
				paint: { "fill-color": "#a8c898" },
			},
			{
				id: "landuse-school",
				type: "fill",
				source: "protomaps",
				"source-layer": "landuse",
				filter: [
					"in",
					["get", "kind"],
					["literal", ["school", "university", "college", "kindergarten"]],
				],
				paint: { "fill-color": "#e0d8c8" },
			},
			{
				id: "landuse-hospital",
				type: "fill",
				source: "protomaps",
				"source-layer": "landuse",
				filter: ["==", ["get", "kind"], "hospital"],
				paint: { "fill-color": "#e8d0d0" },
			},
			{
				id: "landuse-commercial",
				type: "fill",
				source: "protomaps",
				"source-layer": "landuse",
				filter: [
					"in",
					["get", "kind"],
					["literal", ["commercial", "industrial", "railway"]],
				],
				paint: { "fill-color": "#ddd4c4", "fill-opacity": 0.7 },
			},
			{
				id: "landuse-cemetery",
				type: "fill",
				source: "protomaps",
				"source-layer": "landuse",
				filter: ["==", ["get", "kind"], "cemetery"],
				paint: { "fill-color": "#ccc8b8" },
			},

			// Park outlines — subtle but present
			{
				id: "landuse-park-outline",
				type: "line",
				source: "protomaps",
				"source-layer": "landuse",
				filter: [
					"in",
					["get", "kind"],
					[
						"literal",
						[
							"park",
							"garden",
							"nature_reserve",
							"recreation_ground",
							"national_park",
						],
					],
				],
				paint: {
					"line-color": "#9ab88a",
					"line-width": 0.75,
					"line-opacity": 0.6,
				},
			},

			// ── Buildings ─────────────────────────────────────────────────
			{
				id: "buildings",
				type: "fill",
				source: "protomaps",
				"source-layer": "buildings",
				minzoom: 14,
				paint: {
					"fill-color": "#d8d0c4",
					"fill-opacity": [
						"interpolate",
						["linear"],
						["zoom"],
						14,
						0.5,
						17,
						0.85,
					],
				},
			},
			{
				id: "buildings-outline",
				type: "line",
				source: "protomaps",
				"source-layer": "buildings",
				minzoom: 15,
				paint: {
					"line-color": "#c4bdb0",
					"line-width": 0.5,
				},
			},

			// ── Roads ─────────────────────────────────────────────────────
			// Render order: casing (border) first, then fill on top.
			// kind values: highway, major_road, medium_road, minor_road, service, path, other

			// Path / footway
			{
				id: "roads-path",
				type: "line",
				source: "protomaps",
				"source-layer": "roads",
				filter: ["in", ["get", "kind"], ["literal", ["path", "other"]]],
				minzoom: 15,
				layout: { "line-cap": "round", "line-join": "round" },
				paint: {
					"line-color": "#c8c0b0",
					"line-width": ["interpolate", ["linear"], ["zoom"], 15, 0.75, 18, 2],
					"line-dasharray": [2, 2],
				},
			},

			// Service roads
			{
				id: "roads-service-casing",
				type: "line",
				source: "protomaps",
				"source-layer": "roads",
				filter: ["==", ["get", "kind"], "service"],
				minzoom: 15,
				layout: { "line-cap": "round", "line-join": "round" },
				paint: {
					"line-color": "#b8b0a0",
					"line-width": ["interpolate", ["linear"], ["zoom"], 15, 3, 18, 7],
				},
			},
			{
				id: "roads-service",
				type: "line",
				source: "protomaps",
				"source-layer": "roads",
				filter: ["==", ["get", "kind"], "service"],
				minzoom: 15,
				layout: { "line-cap": "round", "line-join": "round" },
				paint: {
					"line-color": "#ede8df",
					"line-width": ["interpolate", ["linear"], ["zoom"], 15, 2, 18, 6],
				},
			},

			// Minor roads
			{
				id: "roads-minor-casing",
				type: "line",
				source: "protomaps",
				"source-layer": "roads",
				filter: ["==", ["get", "kind"], "minor_road"],
				minzoom: 13,
				layout: { "line-cap": "round", "line-join": "round" },
				paint: {
					"line-color": "#b0a898",
					"line-width": ["interpolate", ["linear"], ["zoom"], 13, 2, 18, 12],
				},
			},
			{
				id: "roads-minor",
				type: "line",
				source: "protomaps",
				"source-layer": "roads",
				filter: ["==", ["get", "kind"], "minor_road"],
				minzoom: 13,
				layout: { "line-cap": "round", "line-join": "round" },
				paint: {
					"line-color": "#f5f0e8",
					"line-width": ["interpolate", ["linear"], ["zoom"], 13, 1.5, 18, 10],
				},
			},

			// Medium roads
			{
				id: "roads-medium-casing",
				type: "line",
				source: "protomaps",
				"source-layer": "roads",
				filter: ["==", ["get", "kind"], "medium_road"],
				minzoom: 11,
				layout: { "line-cap": "round", "line-join": "round" },
				paint: {
					"line-color": "#a09888",
					"line-width": ["interpolate", ["linear"], ["zoom"], 11, 2, 18, 16],
				},
			},
			{
				id: "roads-medium",
				type: "line",
				source: "protomaps",
				"source-layer": "roads",
				filter: ["==", ["get", "kind"], "medium_road"],
				minzoom: 11,
				layout: { "line-cap": "round", "line-join": "round" },
				paint: {
					"line-color": "#faf6ee",
					"line-width": ["interpolate", ["linear"], ["zoom"], 11, 1.5, 18, 14],
				},
			},

			// Major roads / arterials
			{
				id: "roads-major-casing",
				type: "line",
				source: "protomaps",
				"source-layer": "roads",
				filter: ["==", ["get", "kind"], "major_road"],
				minzoom: 9,
				layout: { "line-cap": "round", "line-join": "round" },
				paint: {
					"line-color": "#988878",
					"line-width": ["interpolate", ["linear"], ["zoom"], 9, 2, 18, 20],
				},
			},
			{
				id: "roads-major",
				type: "line",
				source: "protomaps",
				"source-layer": "roads",
				filter: ["==", ["get", "kind"], "major_road"],
				minzoom: 9,
				layout: { "line-cap": "round", "line-join": "round" },
				paint: {
					"line-color": "#fff8ec",
					"line-width": ["interpolate", ["linear"], ["zoom"], 9, 1.5, 18, 18],
				},
			},

			// Highway
			{
				id: "roads-highway-casing",
				type: "line",
				source: "protomaps",
				"source-layer": "roads",
				filter: ["==", ["get", "kind"], "highway"],
				minzoom: 7,
				layout: { "line-cap": "round", "line-join": "round" },
				paint: {
					"line-color": "#907858",
					"line-width": ["interpolate", ["linear"], ["zoom"], 7, 2, 18, 26],
				},
			},
			{
				id: "roads-highway",
				type: "line",
				source: "protomaps",
				"source-layer": "roads",
				filter: ["==", ["get", "kind"], "highway"],
				minzoom: 7,
				layout: { "line-cap": "round", "line-join": "round" },
				paint: {
					"line-color": "#fdefd8",
					"line-width": ["interpolate", ["linear"], ["zoom"], 7, 1, 18, 24],
				},
			},

			// Rail
			{
				id: "roads-rail",
				type: "line",
				source: "protomaps",
				"source-layer": "roads",
				filter: ["==", ["get", "kind"], "rail"],
				minzoom: 11,
				paint: {
					"line-color": "#a09888",
					"line-width": 1.5,
					"line-dasharray": [6, 4],
					"line-opacity": 0.65,
				},
			},

			// ── Labels ────────────────────────────────────────────────────
			{
				id: "roads-labels",
				type: "symbol",
				source: "protomaps",
				"source-layer": "roads",
				minzoom: 14,
				layout: {
					"symbol-placement": "line",
					"text-field": ["get", "name"],
					"text-font": ["Noto Sans Regular"],
					"text-size": ["interpolate", ["linear"], ["zoom"], 14, 10, 18, 14],
					"text-max-angle": 30,
					"text-padding": 10,
				},
				paint: {
					"text-color": "#706860",
					"text-halo-color": "#f5f0e8",
					"text-halo-width": 2,
				},
			},
			{
				id: "places-neighbourhood",
				type: "symbol",
				source: "protomaps",
				"source-layer": "places",
				filter: ["==", ["get", "kind"], "neighbourhood"],
				minzoom: 13,
				layout: {
					"text-field": ["get", "name"],
					"text-font": ["Noto Sans Regular"],
					"text-size": 10,
					"text-transform": "uppercase",
					"text-letter-spacing": 0.12,
				},
				paint: {
					"text-color": "#a09888",
					"text-halo-color": "#e8e2d9",
					"text-halo-width": 1.5,
				},
			},
			{
				id: "places-locality",
				type: "symbol",
				source: "protomaps",
				"source-layer": "places",
				filter: ["==", ["get", "kind"], "locality"],
				minzoom: 8,
				maxzoom: 14,
				layout: {
					"text-field": ["get", "name"],
					"text-font": ["Noto Sans Bold"],
					"text-size": ["interpolate", ["linear"], ["zoom"], 8, 11, 13, 16],
				},
				paint: {
					"text-color": "#504840",
					"text-halo-color": "#e8e2d9",
					"text-halo-width": 2,
				},
			},
		],
	}
}
