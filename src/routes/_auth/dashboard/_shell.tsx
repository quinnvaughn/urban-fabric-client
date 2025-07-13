import { createFileRoute, Outlet } from "@tanstack/react-router"
import { css } from "../../../../styled-system/css"
import { DashboardSidebar } from "../../../features/layout"
import { Flex } from "../../../features/ui"

export const Route = createFileRoute("/_auth/dashboard/_shell")({
	component: DashboardLayout,
})

function DashboardLayout() {
	return (
		<Flex direction="column" className={css({ height: "100vh" })}>
			{/** TODO: Navbar */}
			<div>Navbar</div>
			<Flex flex={"auto"} className={css({ overflow: "hidden" })}>
				{/** TODO: sidebar */}
				<DashboardSidebar />
				<Flex
					as="main"
					flex="auto"
					className={css({ overflowY: "auto", p: "lg" })}
				>
					<Outlet />
				</Flex>
			</Flex>
		</Flex>
	)
}
