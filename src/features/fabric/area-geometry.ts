import {
	normalizeBearing,
	offsetPointAlongBearing,
} from "./drawing-layer/street-lock"
import type { AreaShape } from "./element-types/types"

type AreaPolygonParams = {
	center: [number, number]
	bearing: number
	lengthFeet: number
	widthFeet: number
	shape?: AreaShape
}

function offsetLocalPoint(
	center: [number, number],
	bearing: number,
	alongFeet: number,
	acrossFeet: number,
) {
	const alongPoint = offsetPointAlongBearing(center, bearing, alongFeet)
	return offsetPointAlongBearing(
		alongPoint,
		normalizeBearing(bearing + 90),
		acrossFeet,
	)
}

function makeCurbExtensionPolygon(
	params: AreaPolygonParams,
): [number, number][] {
	const { center, bearing } = params
	const lengthFeet = Math.max(params.lengthFeet, 4)
	const widthFeet = Math.max(params.widthFeet, 2)
	const halfLength = lengthFeet / 2
	const halfWidth = widthFeet / 2
	const cornerDepth = Math.min(widthFeet * 0.55, lengthFeet * 0.25)
	const localPoints: [number, number][] = [
		[-halfLength, -halfWidth],
		[halfLength, -halfWidth],
		[halfLength, 0],
	]
	const steps = 5

	for (let i = 1; i <= steps; i += 1) {
		const t = i / steps
		const eased = 1 - (1 - t) * (1 - t)
		localPoints.push([
			halfLength - cornerDepth * eased,
			halfWidth * Math.sin((Math.PI / 2) * t),
		])
	}

	localPoints.push([-halfLength + cornerDepth, halfWidth])

	for (let i = 1; i <= steps; i += 1) {
		const t = i / steps
		const eased = t * t
		localPoints.push([
			-halfLength + cornerDepth * (1 - eased),
			halfWidth * Math.cos((Math.PI / 2) * t),
		])
	}

	localPoints.push([-halfLength, -halfWidth])

	return localPoints.map(([along, across]) =>
		offsetLocalPoint(center, bearing, along, across),
	)
}

function makeCapsulePolygon(params: AreaPolygonParams): [number, number][] {
	const { center, bearing } = params
	const lengthFeet = Math.max(params.lengthFeet, params.widthFeet)
	const widthFeet = Math.max(params.widthFeet, 1)
	const radius = widthFeet / 2
	const straightHalf = Math.max(0, (lengthFeet - widthFeet) / 2)
	const forward = normalizeBearing(bearing)
	const right = normalizeBearing(bearing + 90)
	const startCenter = offsetPointAlongBearing(center, forward, -straightHalf)
	const endCenter = offsetPointAlongBearing(center, forward, straightHalf)
	const points: [number, number][] = []
	const steps = 8

	for (let i = 0; i <= steps; i += 1) {
		const angle = normalizeBearing(forward + 90 - (180 * i) / steps)
		points.push(offsetPointAlongBearing(endCenter, angle, radius))
	}
	for (let i = 0; i <= steps; i += 1) {
		const angle = normalizeBearing(right + 180 - (180 * i) / steps)
		points.push(offsetPointAlongBearing(startCenter, angle, radius))
	}
	points.push(points[0])
	return points
}

function makeCirclePolygon(params: AreaPolygonParams): [number, number][] {
	const { center } = params
	const radiusFeet = Math.max(params.widthFeet, params.lengthFeet, 4) / 2
	const points: [number, number][] = []
	const steps = 32

	for (let i = 0; i < steps; i += 1) {
		points.push(offsetPointAlongBearing(center, (360 * i) / steps, radiusFeet))
	}
	points.push(points[0])
	return points
}

function makeRectanglePolygon(params: AreaPolygonParams): [number, number][] {
	const { center, bearing } = params
	const halfLength = Math.max(params.lengthFeet, 2) / 2
	const halfWidth = Math.max(params.widthFeet, 2) / 2
	const points: [number, number][] = [
		offsetLocalPoint(center, bearing, -halfLength, -halfWidth),
		offsetLocalPoint(center, bearing, halfLength, -halfWidth),
		offsetLocalPoint(center, bearing, halfLength, halfWidth),
		offsetLocalPoint(center, bearing, -halfLength, halfWidth),
	]
	points.push(points[0])
	return points
}

export function makeAreaPolygon(params: AreaPolygonParams): [number, number][] {
	if (params.shape === "circle") return makeCirclePolygon(params)
	if (params.shape === "curb-extension") return makeCurbExtensionPolygon(params)
	if (params.shape === "rectangle") return makeRectanglePolygon(params)
	return makeCapsulePolygon(params)
}
