import { createServerFn } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"

export type LatLng = { lat: number; lng: number }

export const getLocationFromIp = createServerFn({ method: "GET" }).handler(
	async (): Promise<LatLng> => {
		const DEFAULT: LatLng = { lat: 34.0195, lng: -118.4912 } // Santa Monica
		const ip =
			getRequestHeader("x-forwarded-for") ?? getRequestHeader("x-real-ip") ?? ""
		console.log("Client IP address", ip)
		if (!ip) return DEFAULT
		try {
			const res = await fetch(
				`https://api.ipwho.org/${ip}?apiKey=${process.env.IP_WHO_KEY}`,
			)
			console.log("IP Geolocation response", res)
			const json = await res.json()
			if (typeof json.lat !== "number" || typeof json.lon !== "number") {
				return DEFAULT
			}
			return { lat: json.lat, lng: json.lon }
		} catch {
			return DEFAULT
		}
	},
)
