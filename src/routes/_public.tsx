import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router"
import { css } from "../../styled-system/css"
import { Footer, Navbar } from "../features/layout"
import { Flex } from "../features/ui"

export const Route = createFileRoute("/_public")({
	component: Layout,
})

function Layout() {
	const location = useLocation()

	const showAuthLinks = !["/login", "/register"].includes(location.pathname)
	return (
		<Flex direction="column" className={css({ minHeight: "100vh" })}>
			<Navbar showAuthLinks={showAuthLinks} />
			<Flex as="main" grow={"1"} direction="column">
				<Outlet />
			</Flex>
			<Footer />
		</Flex>
	)
}
