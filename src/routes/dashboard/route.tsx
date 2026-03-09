import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { Sidebar } from "#/features/navigation"
import { MeDocument } from "#/graphql/generated"

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const { apolloClient } = context
		const data = apolloClient.readQuery({ query: MeDocument })

		if (!data?.me) {
			throw redirect({ to: "/login", replace: true })
		}
	},
})

function RouteComponent() {
	return (
		<main>
			<Sidebar />
			<Outlet />
		</main>
	)
}
