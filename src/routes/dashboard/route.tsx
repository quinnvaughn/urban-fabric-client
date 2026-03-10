import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { Sidebar, Topbar } from "#/features/navigation"
import { MeDocument } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"

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
		<div
			className={css({
				display: "flex",
				background: "stone.100",
				height: "100%",
				overflow: "hidden",
			})}
		>
			<Sidebar />
			<main
				className={css({
					flex: 1,
					display: "flex",
					flexDirection: "column",
					minW: 0,
					overflow: "hidden",
				})}
			>
				<Topbar />
				<div
					className={css({
						flex: 1,
						overflowY: "auto",
						paddingTop: "7",
						paddingBottom: "12",
						px: "7",
						animation: "fadeUp 0.5s var(--easings-spring) both",
					})}
				>
					<Outlet />
				</div>
			</main>
		</div>
	)
}
