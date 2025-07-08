import { createFileRoute } from "@tanstack/react-router"
import { AuthForm } from "../../features/auth"
import { Container } from "../../features/ui"

export const Route = createFileRoute("/_public/register")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Container>
			<AuthForm mode="register" onSubmit={async (data) => {}} />
		</Container>
	)
}
