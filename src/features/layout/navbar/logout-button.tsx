import { link } from "../../../../styled-system/recipes"

export function LogoutButton() {
	// todo: add logout mutation.
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()
			}}
		>
			<button type="button" className={link()}>
				Logout
			</button>
		</form>
	)
}
