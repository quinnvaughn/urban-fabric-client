import type { ElementInstance } from "./element-types/types"

const EARTH_RADIUS_METERS = 6371008.8
const METERS_TO_FEET = 3.28084
const FEET_PER_MILE = 5280

function toRadians(degrees: number) {
	return (degrees * Math.PI) / 180
}

function segmentLengthMeters(a: [number, number], b: [number, number]): number {
	const [lng1, lat1] = a
	const [lng2, lat2] = b
	const dLat = toRadians(lat2 - lat1)
	const dLng = toRadians(lng2 - lng1)
	const lat1Rad = toRadians(lat1)
	const lat2Rad = toRadians(lat2)

	const sinLat = Math.sin(dLat / 2)
	const sinLng = Math.sin(dLng / 2)
	const haversine =
		sinLat * sinLat + Math.cos(lat1Rad) * Math.cos(lat2Rad) * sinLng * sinLng
	const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))

	return EARTH_RADIUS_METERS * c
}

export function lineLengthFeet(coordinates: [number, number][]): number {
	if (coordinates.length < 2) return 0

	let meters = 0
	for (let i = 1; i < coordinates.length; i += 1) {
		meters += segmentLengthMeters(coordinates[i - 1], coordinates[i])
	}

	return meters * METERS_TO_FEET
}

export function lineLengthMiles(coordinates: [number, number][]): number {
	return lineLengthFeet(coordinates) / FEET_PER_MILE
}

export type ElementTypeSummary = {
	typeId: string
	count: number
	totalLengthMiles: number
}

export function summarizeElementsByType(
	elements: ElementInstance[],
): ElementTypeSummary[] {
	const grouped = new Map<string, ElementTypeSummary>()

	for (const element of elements) {
		const existing = grouped.get(element.typeId)
		const lengthMiles = lineLengthMiles(element.coordinates)

		if (existing) {
			existing.count += 1
			existing.totalLengthMiles += lengthMiles
			continue
		}

		grouped.set(element.typeId, {
			typeId: element.typeId,
			count: 1,
			totalLengthMiles: lengthMiles,
		})
	}

	return [...grouped.values()]
}

export function totalElementLengthMiles(elements: ElementInstance[]): number {
	let total = 0
	for (const element of elements) {
		total += lineLengthMiles(element.coordinates)
	}
	return total
}
