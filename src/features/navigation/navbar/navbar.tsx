import { Link } from "@tanstack/react-router"
import { Avatar, HStack, Typography } from "#/features/ui"
import { useCurrentUser } from "#/lib/graphql"
import { css } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"

export function Navbar() {
	const { data, loading } = useCurrentUser()
	const user = data?.me
	return (
		<header
			className={css({
				position: "sticky",
				top: 0,
				zIndex: "sticky",
				w: "full",
				bg: "bg.base",
				borderBottomWidth: "1px",
				borderBottomColor: "border.subtle",
			})}
		>
			<nav
				className={css({
					px: "4",
					h: "var(--uf-header-height)",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				})}
			>
				<Link to="/">
					<HStack align="center" gap="2">
						<img src="/logo.svg" alt="Urban Fabric" width={24} height={24} />
						<Typography.Text size="sm" weight="bold" font={"sans"}>
							Urban Fabric
						</Typography.Text>
					</HStack>
				</Link>
				<HStack align="center" gap="4">
					{loading ? null : user ? (
						<HStack align="center" gap="2.5">
							<Link
								to="/dashboard"
								className={button({
									appearance: "outline",
									intent: "brand",
									size: "sm",
								})}
							>
								Dashboard
							</Link>
							<Avatar name={user.name} size="sm" tone="accent" />
						</HStack>
					) : (
						<>
							<Link
								to="/login"
								className={button({
									appearance: "outline",
									intent: "neutral",
									size: "sm",
								})}
							>
								Sign in
							</Link>
							<Link
								to="/fabric"
								className={button({
									appearance: "solid",
									intent: "brand",
									size: "sm",
								})}
							>
								Start designing
							</Link>
						</>
					)}
				</HStack>
			</nav>
		</header>
	)
}
