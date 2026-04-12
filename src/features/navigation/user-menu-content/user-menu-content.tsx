import { LogOut, Settings, Users } from "lucide-react"
import { Menu } from "#/features/ui"
import { useCurrentUser, useLogout } from "#/lib/graphql"

interface UserMenuContentProps {
	onBeforeLogout?: () => void
}

export function UserMenuItems({ onBeforeLogout }: UserMenuContentProps) {
	const { logout, isLoggingOut } = useLogout()
	const { user } = useCurrentUser()

	async function handleLogout() {
		await logout({ onBeforeLogout })
	}

	return (
		<>
			{user && (
				<Menu.Link
					to="/user/$username"
					params={{ username: user.username }}
				>
					<Users size={12} />
					<span>Profile</span>
				</Menu.Link>
			)}
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
		</>
	)
}

export function UserMenuContent({ onBeforeLogout }: UserMenuContentProps) {
	return (
		<Menu.Content>
			<UserMenuItems onBeforeLogout={onBeforeLogout} />
		</Menu.Content>
	)
}
