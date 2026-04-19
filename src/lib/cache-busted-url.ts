export function cacheBustedUrl(
	url: string | null | undefined,
	version: string | number | null | undefined,
) {
	if (!url) return ""
	if (!version) return url

	const separator = url.includes("?") ? "&" : "?"
	return `${url}${separator}v=${encodeURIComponent(String(version))}`
}
