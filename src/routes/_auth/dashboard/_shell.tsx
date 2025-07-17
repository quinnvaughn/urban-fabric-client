import { createFileRoute, Outlet } from "@tanstack/react-router"
import { DashboardNavbar, DashboardSidebar } from "../../../features/layout"
import { Flex } from "../../../features/ui"
import { css } from "../../../styles/styled-system/css"

export const Route = createFileRoute("/_auth/dashboard/_shell")({
	component: DashboardLayout,
})

function DashboardLayout() {
	return (
		<Flex direction="column" className={css({ height: "100vh" })}>
			<DashboardNavbar />
			<Flex flex={"auto"} className={css({ overflow: "hidden" })}>
				<DashboardSidebar />
				<Flex
					as="main"
					flex="auto"
					direction={"column"}
					className={css({ overflowY: "auto", p: "lg" })}
				>
					<Outlet />
				</Flex>
			</Flex>
		</Flex>
	)
}
