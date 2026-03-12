import { useMutation } from "@apollo/client/react"
import { useEffect } from "react"
import { SyncViewportDocument } from "#/graphql/generated"
import { useMap } from "../fabric-map"

type Props = {
	id: string
}

export function ViewportTracker({ id }: Props) {
	const map = useMap()

	const [syncViewport] = useMutation(SyncViewportDocument)

	useEffect(() => {
		function handleMoveEnd() {
			const { lng, lat } = map.getCenter()
			const zoom = map.getZoom()
			const pitch = map.getPitch()
			const bearing = map.getBearing()
			syncViewport({
				variables: {
					input: {
						id,
						center: { lng, lat },
						zoom,
						pitch,
						bearing,
					},
				},
			})
		}

		map.on("moveend", handleMoveEnd)
		return () => {
			map.off("moveend", handleMoveEnd)
		}
	}, [map, id, syncViewport])

	return null
}
