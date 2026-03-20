export * from "./get-location-from-ip"

export type Viewport = {
	center: { lat: number; lng: number }
	zoom: number
}

const VIEWPORT_EPSILON = {
	center: 1e-5,
	zoom: 1e-3,
}

export function isSameViewport(a: Viewport, b: Viewport): boolean {
	return (
		Math.abs(a.center.lng - b.center.lng) < VIEWPORT_EPSILON.center &&
		Math.abs(a.center.lat - b.center.lat) < VIEWPORT_EPSILON.center &&
		Math.abs(a.zoom - b.zoom) < VIEWPORT_EPSILON.zoom
	)
}

export function formatLatitude(lat: number) {
	return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`
}

export function formatLongitude(lng: number) {
	return `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`
}
