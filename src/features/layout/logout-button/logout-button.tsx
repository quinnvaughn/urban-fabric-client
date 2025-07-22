import { useLogout } from "../../../hooks"
import { link } from "../../../styles/styled-system/recipes"

export function LogoutButton() {
	const logout = useLogout()
	return (
		<button
			type="button"
			className={link()}
			onClick={async () => {
				await logout()
			}}
		>
			Logout
		</button>
	)
}
