import { createServerFn } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"

export type LatLng = { lat: number; lng: number }

export const getLocationFromIp = createServerFn({ method: "GET" }).handler(
	async (): Promise<LatLng> => {
		const ip =
			getRequestHeader("x-forwarded-for") ?? getRequestHeader("x-real-ip") ?? ""
		if (!ip) {
			return { lat: 34.0195, lng: -118.4912 } // default to Santa Monica in dev
		}
		const res = await fetch(
			`https://api.ipwho.org/${ip}?apiKey=${process.env.IP_WHO_KEY}`,
		)
		const { lat, lon } = await res.json()
		return { lat, lng: lon }
	},
)
