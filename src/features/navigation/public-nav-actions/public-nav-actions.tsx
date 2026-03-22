import { Link } from "@tanstack/react-router"
import { Hamburger, MenuIcon, XIcon } from "lucide-react"
import { useState } from "react"
import { Avatar, HStack, Menu } from "#/features/ui"
import { useCurrentUser } from "#/lib/graphql"
import { useIsMobile } from "#/lib/hooks"
import { css } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"
import { UserMenuContent } from "../user-menu-content"

type AuthenticatedAction = "dashboard" | "new-fabric"
type AuthenticatedActionMode = AuthenticatedAction | "dashboard-and-new-fabric"

interface PublicNavActionsProps {
	authenticatedAction?: AuthenticatedActionMode
}

const authenticatedActionConfig: Record<
	AuthenticatedActionMode,
	Array<{
		to: "/dashboard" | "/fabric/new"
		label: string
		appearance: "outline" | "solid"
		intent: "brand" | "neutral"
	}>
> = {
	dashboard: [
		{
			to: "/dashboard",
			label: "Dashboard",
			appearance: "outline",
			intent: "neutral",
		},
	],
	"new-fabric": [
		{
			to: "/fabric/new",
			label: "Create fabric",
			appearance: "solid",
			intent: "brand",
		},
	],
	"dashboard-and-new-fabric": [
		{
			to: "/dashboard",
			label: "Dashboard",
			appearance: "outline",
			intent: "neutral",
		},
		{
			to: "/fabric/new",
			label: "Create fabric",
			appearance: "solid",
			intent: "brand",
		},
	],
}

export function PublicNavActions({
	authenticatedAction = "dashboard",
}: PublicNavActionsProps) {
	const isMobile = useIsMobile()
	const { data, loading } = useCurrentUser()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const user = data?.me
	const actions = authenticatedActionConfig[authenticatedAction]

	if (loading) return null

	if (user) {
		if (isMobile) {
			return (
				<Menu placement="bottom-end">
					<Menu.Trigger>
						<Hamburger size={20} color="var(--colors-stone-900)" />
					</Menu.Trigger>
				</Menu>
			)
		}
		return (
			<HStack align="center" gap="2.5">
				{actions.map((action) => (
					<Link
						key={action.to}
						to={action.to}
						className={button({
							appearance: action.appearance,
							intent: action.intent,
							size: "sm",
						})}
					>
						{action.label}
					</Link>
				))}
				<Menu
					placement="bottom-end"
					open={isMenuOpen}
					onOpenChange={setIsMenuOpen}
				>
					<Menu.Trigger>
						<button type="button" className={css({ cursor: "pointer" })}>
							<Avatar name={user.name} size="sm" tone="accent" />
						</button>
					</Menu.Trigger>
					<UserMenuContent onBeforeLogout={() => setIsMenuOpen(false)} />
				</Menu>
			</HStack>
		)
	}

	if (isMobile) {
		return (
			<Menu
				placement="bottom-end"
				open={isMenuOpen}
				onOpenChange={setIsMenuOpen}
			>
				<Menu.Trigger>
					<button
						type="button"
						className={css({
							cursor: "pointer",
							position: "relative",
							w: "20px",
							h: "20px",
						})}
					>
						<MenuIcon
							size={20}
							color="var(--colors-stone-900)"
							style={{
								position: "absolute",
								inset: 0,
								transition: "opacity 150ms ease, transform 150ms ease",
								opacity: isMenuOpen ? 0 : 1,
								transform: isMenuOpen
									? "rotate(45deg) scale(0.8)"
									: "rotate(0deg) scale(1)",
							}}
						/>
						<XIcon
							size={20}
							color="var(--colors-stone-900)"
							style={{
								position: "absolute",
								inset: 0,
								transition: "opacity 150ms ease, transform 150ms ease",
								opacity: isMenuOpen ? 1 : 0,
								transform: isMenuOpen
									? "rotate(0deg) scale(1)"
									: "rotate(-45deg) scale(0.8)",
							}}
						/>
					</button>
				</Menu.Trigger>
				<Menu.Content>
					<Menu.Link to="/login">Sign in</Menu.Link>
					<Menu.Link to="/fabric/new">Start designing</Menu.Link>
				</Menu.Content>
			</Menu>
		)
	}

	return (
		<HStack align="center" gap="4">
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
				to="/fabric/new"
				className={button({
					appearance: "solid",
					intent: "brand",
					size: "sm",
				})}
			>
				Start designing
			</Link>
		</HStack>
	)
}
