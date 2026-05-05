const EARTH_RADIUS_METERS = 6371008.8
const FEET_PER_METER = 3.28084
const METERS_PER_FOOT = 1 / FEET_PER_METER
export const DEFAULT_WAVINESS_FEET = 24
const MIN_WAVE_STEPS = 16
const POINTS_PER_WAVE = 12

type Point = [number, number]

function toRadians(degrees: number) {
	return (degrees * Math.PI) / 180
}

function toDegrees(radians: number) {
	return (radians * 180) / Math.PI
}

function segmentLengthFeet(start: Point, end: Point) {
	const [lng1, lat1] = start
	const [lng2, lat2] = end
	const dLat = toRadians(lat2 - lat1)
	const dLng = toRadians(lng2 - lng1)
	const lat1Rad = toRadians(lat1)
	const lat2Rad = toRadians(lat2)
	const sinLat = Math.sin(dLat / 2)
	const sinLng = Math.sin(dLng / 2)
	const haversine =
		sinLat * sinLat + Math.cos(lat1Rad) * Math.cos(lat2Rad) * sinLng * sinLng
	const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))

	return EARTH_RADIUS_METERS * c * FEET_PER_METER
}

function projectToMeters(
	point: Point,
	origin: Point,
): { x: number; y: number } {
	const [originLng, originLat] = origin
	const latRad = toRadians(originLat)
	return {
		x: toRadians(point[0] - originLng) * EARTH_RADIUS_METERS * Math.cos(latRad),
		y: toRadians(point[1] - originLat) * EARTH_RADIUS_METERS,
	}
}

function unprojectFromMeters(
	point: { x: number; y: number },
	origin: Point,
): Point {
	const [originLng, originLat] = origin
	const latRad = toRadians(originLat)
	return [
		originLng + toDegrees(point.x / (EARTH_RADIUS_METERS * Math.cos(latRad))),
		originLat + toDegrees(point.y / EARTH_RADIUS_METERS),
	]
}

export function makeWavySegment(
	start: Point,
	end: Point,
	wavinessFeet = DEFAULT_WAVINESS_FEET,
): Point[] {
	const amplitudeMeters = Math.max(0, wavinessFeet) * METERS_PER_FOOT
	if (amplitudeMeters <= 0) return [start, end]

	const lengthFeet = segmentLengthFeet(start, end)
	if (lengthFeet < Math.max(20, wavinessFeet * 3)) return [start, end]

	const waveLengthFeet = Math.max(80, wavinessFeet * 8)
	const waveCount = Math.max(1, Math.round(lengthFeet / waveLengthFeet))
	const steps = Math.max(MIN_WAVE_STEPS, waveCount * POINTS_PER_WAVE)
	const endMeters = projectToMeters(end, start)
	const segmentLengthMeters = Math.hypot(endMeters.x, endMeters.y)
	if (segmentLengthMeters <= 0) return [start, end]

	const unit = {
		x: endMeters.x / segmentLengthMeters,
		y: endMeters.y / segmentLengthMeters,
	}
	const normal = { x: -unit.y, y: unit.x }
	const coords: Point[] = []

	for (let i = 0; i <= steps; i += 1) {
		const t = i / steps
		const offset = Math.sin(t * waveCount * Math.PI * 2) * amplitudeMeters
		coords.push(
			unprojectFromMeters(
				{
					x: endMeters.x * t + normal.x * offset,
					y: endMeters.y * t + normal.y * offset,
				},
				start,
			),
		)
	}

	coords[0] = start
	coords[coords.length - 1] = end
	return coords
}

export function makeDrawableSegmentsFromWaypoints(
	waypoints: Point[],
	lineShape?: "straight" | "wavy",
	wavinessFeet = DEFAULT_WAVINESS_FEET,
): Point[][] {
	const segments: Point[][] = []
	for (let i = 0; i < waypoints.length - 1; i += 1) {
		const start = waypoints[i]
		const end = waypoints[i + 1]
		segments.push(
			lineShape === "wavy"
				? makeWavySegment(start, end, wavinessFeet)
				: [start, end],
		)
	}
	return segments
}
