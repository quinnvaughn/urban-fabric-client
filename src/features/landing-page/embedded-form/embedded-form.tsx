import { useEffect } from "react"

export function EmbeddedForm() {
	useEffect(() => {
		const widgetScriptSrc = "https://tally.so/widgets/embed.js"

		function load() {
			// Backfill src for iframes that rely on data-tally-src
			document
				.querySelectorAll<HTMLIFrameElement>(
					"iframe[data-tally-src]:not([src])",
				)
				.forEach((el) => {
					el.src = el.dataset.tallySrc || ""
				})
		}

		if (document.querySelector(`script[src="${widgetScriptSrc}"]`)) {
			load()
			return
		}

		const script = document.createElement("script")
		script.src = widgetScriptSrc
		script.async = true
		script.onload = load
		script.onerror = load
		document.body.appendChild(script)
	}, [])

	return (
		<div>
			<iframe
				data-tally-src="https://tally.so/embed/wgla0J?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
				loading="lazy"
				width="100%"
				// Let dynamicHeight control the height; keep a sensible minimum
				style={{ minHeight: 600 }}
				title="Urban Fabric Beta Sign up"
			/>
		</div>
	)
}
