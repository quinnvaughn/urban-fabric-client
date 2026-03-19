import { Link, useMatches } from "@tanstack/react-router"
import { Typography } from "#/features/ui"
import { css, cx } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"

export function Topbar() {
	// get route name
	const matches = useMatches()

	const routeNames: Record<string, string> = {
		"/dashboard/": "Dashboard",
		"/dashboard/fabrics": "Fabrics",
		"/dashboard/proposals": "Proposals",
		"/dashboard/explore": "Explore",
	}

	const currentMatch = matches[matches.length - 1]
	const name = routeNames[currentMatch.routeId] || null

	return (
		<header
			className={css({
				height: "var(--uf-topbar-height)",
				flexShrink: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: "3",
				px: "7",
				borderBottom: "1px solid",
				borderBottomColor: "stone.200",
				background: "bg.base",
				animation: "fadeDown 0.4s var(--easings-spring) both",
			})}
		>
			<Typography.Text size="sm" weight="semibold">
				{name}
			</Typography.Text>
			<Link
				className={cx(
					button({ intent: "brand", appearance: "solid", size: "sm" }),
					css({ textDecoration: "none" }),
				)}
				to="/fabric/new"
				preload={false}
			>
				+ New Fabric
			</Link>
		</header>
	)
}
