import { useMutation } from "@apollo/client/index.js"
import { useNavigate } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { link } from "../../../../styled-system/recipes"
import { LogoutDocument } from "../../../graphql/generated"

export function LogoutButton() {
	// todo: add logout mutation.
	const [logout] = useMutation(LogoutDocument)
	const navigate = useNavigate()
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				e.stopPropagation()
				const { data } = await logout()

				match(data?.logout)
					.with(true, () => {
						navigate({ to: "/" })
					})
					.otherwise(() => {
						// todo: add toast
					})
			}}
		>
			<button type="submit" className={link()}>
				Logout
			</button>
		</form>
	)
}
