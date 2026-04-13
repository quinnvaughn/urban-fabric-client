import {
	ChevronDown,
	Layers,
	LayoutGrid,
	Search,
	UsersRound,
} from "lucide-react"
import { useState } from "react"
import {
	Avatar,
	Box,
	Button,
	HStack,
	Logo,
	Menu,
	Typography,
} from "#/features/ui"
import { useCurrentUser } from "#/lib/graphql"
import { css } from "#/styles/styled-system/css"
import { UserMenuContent } from "../user-menu-content"
import { SidebarLink } from "./sidebar-link"
import { SidebarSectionLabel } from "./sidebar-section-label"

export function Sidebar() {
	const { user } = useCurrentUser()
	const [isMenuOpen, setIsMenuOpen] = useState(false)

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
					preload="intent"
				>
					Dashboard
				</SidebarLink>
				<SidebarLink
					icon={<Layers size={16} />}
					to="/dashboard/fabrics"
					preload="intent"
				>
					Fabrics
				</SidebarLink>
				<SidebarLink
					icon={
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>proposal icon</title>
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
							<polyline points="14 2 14 8 20 8"></polyline>
						</svg>
					}
					to="/dashboard/proposals"
					preload="intent"
				>
					Proposals
				</SidebarLink>
				<SidebarSectionLabel>Community</SidebarSectionLabel>
				<SidebarLink
					preload="intent"
					icon={<UsersRound size={16} />}
					to="/dashboard/following"
				>
					Following
				</SidebarLink>
				<SidebarLink icon={<Search size={16} />} to="/explore" preload="intent">
					Explore
				</SidebarLink>
			</Box>
			<Box
				className={css({
					borderTop: "1px solid",
					borderTopColor: "stone.200",
					flexShrink: 0,
					py: "3",
					px: "2.5",
				})}
			>
				<Menu
					placement="top-start"
					open={isMenuOpen}
					onOpenChange={setIsMenuOpen}
				>
					<Menu.Trigger>
						<Button
							size="sm"
							type="button"
							appearance="ghost"
							intent="neutral"
							className={css({
								display: "flex",
								w: "full",
								gap: "2.5",
								justifyContent: "space-between",
								_hover: {
									background: "stone.100",
									color: "stone.900",
								},
								'&[aria-expanded="true"]': {
									background: "stone.100",
									color: "stone.900",
								},
							})}
						>
							<HStack gap="2.5" align="center">
								<Avatar
									size="sm"
									name={user?.name ?? "User"}
									profilePictureUrl={user?.profilePictureUrl}
								/>
								<Typography.Text size="sm">
									{user?.name ?? "User"}
								</Typography.Text>
							</HStack>
							<ChevronDown
								size={12}
								className={css({
									transition: "transform 150ms",
									transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
								})}
							/>
						</Button>
					</Menu.Trigger>
					<UserMenuContent onBeforeLogout={() => setIsMenuOpen(false)} />
				</Menu>
			</Box>
		</aside>
	)
}
