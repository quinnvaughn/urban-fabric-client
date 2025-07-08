import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/profile")({
	component: RouteComponent,
})

function RouteComponent() {
	const { user } = Route.useRouteContext()
	return <div>Hello {user?.name}</div>
}
