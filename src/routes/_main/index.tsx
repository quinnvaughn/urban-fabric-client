import { createFileRoute } from "@tanstack/react-router"
import { Link } from "#/features/ui"

export const Route = createFileRoute("/_main/")({ component: App })

function App() {
	return (
		<main>
			Main page. Go to login page: <Link to="/login">Login</Link>
		</main>
	)
}
