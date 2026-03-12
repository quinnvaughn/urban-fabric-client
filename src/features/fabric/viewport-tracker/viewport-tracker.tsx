import { useMutation } from "@apollo/client/react"
import { useEffect, useRef } from "react"
import { SyncViewportDocument } from "#/graphql/generated"
import { useMap } from "../fabric-map"

type Props = {
	id: string
}

const VIEWPORT_EVENTS = ["moveend", "zoomend", "rotateend"] as const

export function ViewportTracker({ id }: Props) {
	const map = useMap()
	const [syncViewport] = useMutation(SyncViewportDocument)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		function handleViewportChange() {
			if (timerRef.current) clearTimeout(timerRef.current)
			timerRef.current = setTimeout(() => {
				const { lng, lat } = map.getCenter()
				syncViewport({
					variables: {
						input: {
							id,
							center: { lng, lat },
							zoom: map.getZoom(),
							bearing: map.getBearing(),
						},
					},
				})
			}, 600)
		}

		for (const event of VIEWPORT_EVENTS) {
			map.on(event, handleViewportChange)
		}

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current)
			for (const event of VIEWPORT_EVENTS) {
				map.off(event, handleViewportChange)
			}
		}
	}, [map, id, syncViewport])

	return null
}
