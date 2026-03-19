import { Layers, LayoutGrid, ScrollText, Search } from "lucide-react"
import { Box, Logo } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { SidebarLink } from "./sidebar-link"
import { SidebarSectionLabel } from "./sidebar-section-label"

export function Sidebar() {
	return (
		<aside
			className={css({
				height: "100dvh",
				width: "var(--uf-sidebar-width)",
				backgroundColor: "stone.50",
				flexShrink: 0,
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
				animation: "fadeInLeft 0.4s var(--easings-spring) both",
				borderRightWidth: "1px",
				borderRightStyle: "solid",
				borderRightColor: "stone.200",
			})}
			aria-label="Sidebar navigation"
		>
			<Box
				sx={{
					paddingInline: "2.5",
					borderBottomWidth: "1px",
					borderBottomStyle: "solid",
					borderBottomColor: "stone.200",
					flexShrink: 0,
					height: "var(--uf-topbar-height)",
					display: "flex",
					alignItems: "center",
				}}
			>
				<Logo />
			</Box>
			<Box
				sx={{
					flex: 1,
					gap: "0.5",
					display: "flex",
					flexDirection: "column",
					py: "3",
					px: "2.5",
				}}
			>
				<SidebarSectionLabel>Workspace</SidebarSectionLabel>
				<SidebarLink
					icon={<LayoutGrid size={16} />}
					activeOptions={{ exact: true }}
					to="/dashboard"
				>
					Dashboard
				</SidebarLink>
				<SidebarLink icon={<Layers size={16} />} to="/dashboard/fabrics">
					Fabrics
				</SidebarLink>
				<SidebarLink icon={<ScrollText size={16} />} to="/dashboard/proposals">
					Proposals
				</SidebarLink>
				<SidebarSectionLabel>Community</SidebarSectionLabel>
				<SidebarLink icon={<Search size={16} />} to="/dashboard/explore">
					Explore
				</SidebarLink>
			</Box>
		</aside>
	)
}
