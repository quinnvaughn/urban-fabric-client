import { useEffect, useMemo, useRef, useState } from "react"
import {
	formatCalculatedValue,
	getCalculatedValue,
} from "./element-metrics"
import type { ElementDescriptor, ElementInstance } from "./element-types/types"
import { nearestRoadName } from "./osrm-utils"

function coordinateKey(coord?: [number, number]) {
	if (!coord) return ""
	return `${coord[0].toFixed(5)},${coord[1].toFixed(5)}`
}

export type CalculatedRow = {
	key: string
	label: string
	value: string
}

export function useCalculatedRows(
	instance: ElementInstance | null,
	descriptor: ElementDescriptor | null,
): CalculatedRow[] {
	const routeEndpoints = useMemo(() => {
		if (!instance) return { from: undefined, to: undefined }
		const points = instance.waypoints.length
			? instance.waypoints
			: instance.coordinates
		return { from: points[0], to: points[points.length - 1] }
	}, [instance])

	const fromKey = coordinateKey(routeEndpoints.from)
	const toKey = coordinateKey(routeEndpoints.to)
	const streetNameCacheRef = useRef(new Map<string, string>())
	const [streetNames, setStreetNames] = useState<{
		from: string | null
		to: string | null
	}>({ from: null, to: null })

	useEffect(() => {
		if (!instance || !routeEndpoints.from || !routeEndpoints.to) {
			setStreetNames({ from: null, to: null })
			return
		}

		let cancelled = false

		async function resolveStreetName(
			coord: [number, number],
			key: string,
		): Promise<string | null> {
			const cached = streetNameCacheRef.current.get(key)
			if (cached) return cached
			try {
				const name = await nearestRoadName(coord[0], coord[1])
				if (name) streetNameCacheRef.current.set(key, name)
				return name
			} catch {
				return null
			}
		}

		Promise.all([
			resolveStreetName(routeEndpoints.from, fromKey),
			resolveStreetName(routeEndpoints.to, toKey),
		]).then(([fromName, toName]) => {
			if (cancelled) return
			setStreetNames({ from: fromName, to: toName })
		})

		return () => {
			cancelled = true
		}
	}, [instance, routeEndpoints, fromKey, toKey])

	return useMemo(() => {
		if (!descriptor || !instance) return []
		return descriptor.calculated.map((field) => ({
			key: field.key,
			label: field.label,
			value: formatCalculatedValue(
				getCalculatedValue(field.key, instance, streetNames),
				field.unit,
			),
		}))
	}, [descriptor, instance, streetNames])
}
