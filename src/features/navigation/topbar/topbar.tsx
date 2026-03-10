import { useMatches } from "@tanstack/react-router"
import { Typography } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

export function Topbar() {
	// get route name
	const matches = useMatches()

	const routeNames: Record<string, string> = {
		"/dashboard/": "Dashboard",
		"/dashboard/fabrics": "Fabrics",
		"/dashboard/proposals": "Proposals",
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
				gap: "3",
				px: "7",
				borderBottom: "1px solid",
				borderColor: "stone.200",
				background: "bg.base",
				animation: "fadeDown 0.4s var(--easings-spring) both",
			})}
		>
			<Typography.Text size="sm" weight="semibold">
				{name}
			</Typography.Text>
		</header>
	)
}
