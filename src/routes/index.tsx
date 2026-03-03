import { createFileRoute } from "@tanstack/react-router"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/")({ component: App })

function App() {
	return (
		<main>
			Home page
			<p className={css({ color: "brand.default" })}>
				This is a paragraph with brand primary color.
			</p>
		</main>
	)
}
