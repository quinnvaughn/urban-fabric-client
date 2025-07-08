import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ context: { user } }) => {
		if (!user) {
			return redirect({ to: "/" })
		}
	},
	component: Layout,
})

function Layout() {
	return <Outlet />
}
