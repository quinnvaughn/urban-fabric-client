import { Link } from "@tanstack/react-router"
import { HStack, Typography } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"

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
					<HStack align="center" gap="2">
						<img src="/logo.svg" alt="Urban Fabric" width={24} height={24} />
						<Typography.Text size="sm" weight="bold" font={"sans"}>
							Urban Fabric
						</Typography.Text>
					</HStack>
				</Link>
				<HStack align="center" gap="4">
					<Link
						to="/login"
						className={css({
							textDecoration: { _hover: "underline" },
						})}
					>
						Sign in
					</Link>
					<Link
						to="/register"
						className={button({ appearance: "solid", intent: "brand" })}
					>
						Sign up
					</Link>
				</HStack>
			</nav>
		</header>
	)
}
