import { Link } from "@tanstack/react-router"
import { HStack, Typography } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

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
					maxW: "7xl",
					px: "4",
					h: "50px",
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
			</nav>
		</header>
	)
}
