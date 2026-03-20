import { useEffect, useState } from "react"
import type { LatLng } from "#/lib/geo/get-location-from-ip"

type Props = {
	ipLocation: LatLng
}

// Silently upgrades to GPS only if the user has already granted permission.
// Does NOT prompt — call navigator.geolocation.getCurrentPosition yourself for that.
export function useFocusLocation({ ipLocation }: Props): LatLng {
	const [focusLocation, setFocusLocation] = useState<LatLng>(ipLocation)

	useEffect(() => {
		if (!navigator.geolocation || !navigator.permissions) return
		navigator.permissions.query({ name: "geolocation" }).then((result) => {
			if (result.state !== "granted") return
			navigator.geolocation.getCurrentPosition((pos) =>
				setFocusLocation({
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				}),
			)
		})
	}, [])

	return focusLocation
}
