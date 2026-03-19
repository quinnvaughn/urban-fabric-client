import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router"
import { Navbar } from "#/features/navigation"
import { HStack } from "#/features/ui/layout/layout"
import { Typography } from "#/features/ui/typography/typography"
import { MeDocument } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/_marketing")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		const user = context.apolloClient.readQuery({ query: MeDocument })

		if (user?.me) {
			throw redirect({ to: "/dashboard", replace: true })
		}
	},
})

function RouteComponent() {
	return (
		<>
			<Navbar />
			<Outlet />
			<footer
				className={css({
					bg: "white",
					borderTop: "1px solid {colors.border.subtle}",
					paddingBlock: "8",
					paddingInline: "20",
				})}
			>
				<Link to="/">
					<HStack align="center" gap="2">
						<img src="/logo.svg" alt="Urban Fabric" width={24} height={24} />
						<Typography.Text
							size="xs"
							weight="bold"
							font="sans"
							color="stone.500"
							letterSpacing="wide"
							transform="uppercase"
						>
							Urban Fabric
						</Typography.Text>
					</HStack>
				</Link>
			</footer>
		</>
	)
}
