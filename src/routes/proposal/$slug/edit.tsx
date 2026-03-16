import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/proposal/$slug/edit")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/proposal/$id/edit"!</div>
}
