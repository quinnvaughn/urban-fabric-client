import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute(
	"/_auth/dashboard/simulation/$simulationId",
)({
	component: RouteComponent,
})

function RouteComponent() {
	return <Outlet />
}
