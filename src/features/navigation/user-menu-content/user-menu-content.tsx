import { LogOut, Settings } from "lucide-react"
import { Menu } from "#/features/ui"
import { useLogout } from "#/lib/graphql"

interface UserMenuContentProps {
	onBeforeLogout?: () => void
}

export function UserMenuContent({ onBeforeLogout }: UserMenuContentProps) {
	const { logout, isLoggingOut } = useLogout()

	async function handleLogout() {
		await logout({ onBeforeLogout })
	}

	return (
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
	)
}
