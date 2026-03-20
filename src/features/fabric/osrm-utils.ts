import { useLazyQuery } from "@apollo/client/react"
import { useCallback } from "react"
import {
	NearestRoadNameDocument,
	RouteBetweenDocument,
	SnapToRoadDocument,
} from "#/graphql/generated"

export function useSnapToRoad() {
	const [execute] = useLazyQuery(SnapToRoadDocument)
	return useCallback(
		async (lng: number, lat: number): Promise<[number, number]> => {
			const result = await execute({ variables: { lat, lng } })
			const coord = result.data?.snapToRoad
			if (!coord) return [lng, lat]
			return [coord.lng, coord.lat]
		},
		[execute],
	)
}

export function useNearestRoadName() {
	const [execute] = useLazyQuery(NearestRoadNameDocument)
	return useCallback(
		async (lng: number, lat: number): Promise<string | null> => {
			const result = await execute({ variables: { lat, lng } })
			return result.data?.nearestRoadName ?? null
		},
		[execute],
	)
}

export function useRouteBetween() {
	const [execute] = useLazyQuery(RouteBetweenDocument)
	return useCallback(
		async (
			a: [number, number],
			b: [number, number],
		): Promise<[number, number][]> => {
			const result = await execute({
				variables: { a: { lng: a[0], lat: a[1] }, b: { lng: b[0], lat: b[1] } },
			})
			return (result.data?.routeBetween ?? []).map(
				(c) => [c.lng, c.lat] as [number, number],
			)
		},
		[execute],
	)
}

export function flattenSegments(
	segments: [number, number][][],
): [number, number][] {
	return segments.flatMap((seg, i) => (i === 0 ? seg : seg.slice(1)))
}
