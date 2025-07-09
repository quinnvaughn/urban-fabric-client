import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { css } from "../../styled-system/css"
import { Footer, PublicNavbar } from "../features/layout"
import { Flex } from "../features/ui"

export const Route = createFileRoute("/_public")({
	component: Layout,
	beforeLoad: ({ context }) => {
		if (context.user) {
			return redirect({ to: "/dashboard" })
		}
	},
})

function Layout() {
	return (
		<Flex direction="column" className={css({ minHeight: "100vh" })}>
			<PublicNavbar />
			<Flex as="main" grow={"1"} direction="column">
				<Outlet />
			</Flex>
			<Footer />
		</Flex>
	)
}
