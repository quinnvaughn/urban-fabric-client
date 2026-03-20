import {
	ChevronDown,
	Layers,
	LayoutGrid,
	LogOut,
	ScrollText,
	Search,
	Settings,
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
import { useCurrentUser, useLogout } from "#/lib/graphql"
import { css } from "#/styles/styled-system/css"
import { SidebarLink } from "./sidebar-link"
import { SidebarSectionLabel } from "./sidebar-section-label"

export function Sidebar() {
	const { data: meData } = useCurrentUser()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const { logout, isLoggingOut } = useLogout()

	async function handleLogout() {
		await logout({ onBeforeLogout: () => setIsMenuOpen(false) })
	}

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
								<Avatar size="sm" name={meData?.me?.name ?? "User"} />
								<Typography.Text size="sm">
									{meData?.me?.name ?? "User"}
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
					<Menu.Content>
						<Menu.Link to="/dashboard/settings">
							<Settings size={12} />
							<span>Settings</span>
						</Menu.Link>
						<Menu.Separator />
						<Menu.Item
							intent="danger"
							disabled={isLoggingOut}
							onClick={() => void handleLogout()}
						>
							<LogOut size={12} />
							<span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
						</Menu.Item>
					</Menu.Content>
				</Menu>
			</Box>
		</aside>
	)
}
