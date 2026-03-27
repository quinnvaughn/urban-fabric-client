import { Link } from "@tanstack/react-router"
import { HStack, Logo } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { PublicNavActions } from "../public-nav-actions"

export function Navbar() {
	return (
		<header
			className={css({
				position: "sticky",
				top: 0,
				zIndex: "sticky",
				w: "full",
				bg: "white",
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
					<Logo />
				</Link>
				<HStack align="center" gap="4">
					<PublicNavActions authenticatedAction="dashboard" />
				</HStack>
			</nav>
		</header>
	)
}
