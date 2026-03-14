import type maplibregl from "maplibre-gl"

export function hasLayer(map: maplibregl.Map, id: string): boolean {
	try {
		return Boolean(map.getLayer(id))
	} catch {
		return false
	}
}

export function hasSource(map: maplibregl.Map, id: string): boolean {
	try {
		return Boolean(map.getSource(id))
	} catch {
		return false
	}
}

export function hasImage(map: maplibregl.Map, id: string): boolean {
	try {
		return map.hasImage(id)
	} catch {
		return false
	}
}

export function removeLayersIfPresent(
	map: maplibregl.Map,
	ids: readonly string[],
): void {
	for (const id of ids) {
		if (hasLayer(map, id)) map.removeLayer(id)
	}
}

export function removeSourcesIfPresent(
	map: maplibregl.Map,
	ids: readonly string[],
): void {
	for (const id of ids) {
		if (hasSource(map, id)) map.removeSource(id)
	}
}

export function removeImageIfPresent(map: maplibregl.Map, id: string): void {
	if (hasImage(map, id)) map.removeImage(id)
}
