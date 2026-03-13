const OSRM_BASE =
	import.meta.env.VITE_OSRM_URL ?? "https://router.project-osrm.org"

export async function snapToRoad(
	lng: number,
	lat: number,
): Promise<[number, number]> {
	const res = await fetch(
		`${OSRM_BASE}/nearest/v1/driving/${lng},${lat}?number=1`,
	)
	const data = await res.json()
	return data.waypoints[0].location as [number, number]
}

export async function nearestRoadName(
	lng: number,
	lat: number,
): Promise<string | null> {
	const res = await fetch(
		`${OSRM_BASE}/nearest/v1/driving/${lng},${lat}?number=1`,
	)
	const data = await res.json()
	const name = data.waypoints?.[0]?.name
	if (typeof name !== "string") return null
	const trimmed = name.trim()
	return trimmed.length > 0 ? trimmed : null
}

export async function routeBetween(
	a: [number, number],
	b: [number, number],
): Promise<[number, number][]> {
	const coords = `${a[0]},${a[1]};${b[0]},${b[1]}`
	const res = await fetch(
		`${OSRM_BASE}/route/v1/driving/${coords}?overview=full&geometries=geojson`,
	)
	const data = await res.json()
	return data.routes[0].geometry.coordinates as [number, number][]
}

export function flattenSegments(
	segments: [number, number][][],
): [number, number][] {
	return segments.flatMap((seg, i) => (i === 0 ? seg : seg.slice(1)))
}
