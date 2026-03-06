import { createFileRoute } from "@tanstack/react-router"
import { AuthForm } from "#/features/auth"

export const Route = createFileRoute("/_main/_auth/register")({
	component: RouteComponent,
})

function RouteComponent() {
	return <AuthForm mode="register" />
}
