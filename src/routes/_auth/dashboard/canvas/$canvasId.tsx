import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/dashboard/canvas/$canvasId")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/_auth/dashboard/$canvasId"!</div>
}
