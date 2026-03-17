import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/proposals")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/dashboard/proposals"!</div>
}
