import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { Sidebar, Topbar } from "#/features/navigation"
import { MeDocument } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	pendingComponent: DashboardPendingComponent,
	beforeLoad: async ({ context }) => {
		const { apolloClient } = context
		const data = apolloClient.readQuery({ query: MeDocument })

		if (!data?.me) {
			throw redirect({ to: "/login", replace: true })
		}
	},
})

function DashboardPendingComponent() {
	return (
		<div
			className={css({
				display: "flex",
				background: "stone.100",
				height: "100dvh",
				width: "100%",
				overflow: "hidden",
			})}
		>
			<aside
				className={css({
					height: "100dvh",
					width: "var(--uf-sidebar-width)",
					borderRightWidth: "1px",
					borderColor: "stone.200",
					bg: "stone.50",
					display: { base: "none", lg: "block" },
				})}
			/>
			<main
				className={css({
					flex: 1,
					display: "flex",
					flexDirection: "column",
					minW: 0,
				})}
			>
				<div
					className={css({
						h: "4rem",
						borderBottomWidth: "1px",
						borderColor: "stone.200",
						bg: "stone.0",
					})}
				/>
				<div
					className={css({
						p: { base: "4", md: "6" },
						display: "grid",
						gap: "4",
						gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
					})}
				>
					{["one", "two", "three", "four"].map((skeletonId) => (
						<div
							key={skeletonId}
							className={css({
								h: "7.5rem",
								rounded: "lg",
								bg: "stone.0",
								borderWidth: "1px",
								borderColor: "stone.200",
							})}
						/>
					))}
				</div>
			</main>
		</div>
	)
}

function RouteComponent() {
	return (
		<div
			className={css({
				display: "flex",
				background: "stone.100",
				height: "100dvh",
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
				<Outlet />
			</main>
		</div>
	)
}
