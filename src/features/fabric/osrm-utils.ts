import polyline from "@mapbox/polyline"

const STADIA_BASE = "https://api.stadiamaps.com"
const API_KEY = process.env.STADIA_API_KEY

export async function snapToRoad(
	lng: number,
	lat: number,
): Promise<[number, number]> {
	const res = await fetch(
		`${STADIA_BASE}/nearest_roads/v1?api_key=${API_KEY}`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				locations: [{ lon: lng, lat }],
			}),
		},
	)
	const data = await res.json()
	const edge = data.edges?.[0]
	// fall back to input if no snap found
	if (!edge) return [lng, lat]
	const snapped = edge.snapped_location
	return [snapped.lon, snapped.lat]
}

export async function nearestRoadName(
	lng: number,
	lat: number,
): Promise<string | null> {
	const res = await fetch(
		`${STADIA_BASE}/nearest_roads/v1?api_key=${API_KEY}`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				locations: [{ lon: lng, lat, radius: 50 }],
				verbose: true,
			}),
		},
	)
	const data = await res.json()
	const edges = data?.[0]?.edges ?? []
	for (const edge of edges) {
		const name = edge?.edge_info?.names?.[0]
		if (typeof name === "string" && name.trim().length > 0) return name.trim()
	}
	return null
}

export async function routeBetween(
	a: [number, number],
	b: [number, number],
): Promise<[number, number][]> {
	const res = await fetch(`${STADIA_BASE}/route/v1?api_key=${API_KEY}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			locations: [
				{ lon: a[0], lat: a[1], type: "break" },
				{ lon: b[0], lat: b[1], type: "break" },
			],
			costing: "auto",
		}),
	})
	const data = await res.json()
	// Valhalla returns an encoded polyline with precision 6
	const decoded = polyline.decode(data.trip.legs[0].shape, 6)
	// polyline.decode returns [lat, lng] pairs — swap to [lng, lat] for MapLibre
	return decoded.map(([lat, lng]) => [lng, lat])
}

export function flattenSegments(
	segments: [number, number][][],
): [number, number][] {
	return segments.flatMap((seg, i) => (i === 0 ? seg : seg.slice(1)))
}
