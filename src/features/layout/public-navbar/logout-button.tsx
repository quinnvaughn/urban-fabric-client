import { useMutation } from "@apollo/client/index.js"
import { useNavigate } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { LogoutDocument } from "../../../graphql/generated"
import { useToast } from "../../../hooks"
import { link } from "../../../styles/styled-system/recipes"

export function LogoutButton() {
	const [logout] = useMutation(LogoutDocument)
	const navigate = useNavigate()
	const { addToast } = useToast()
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
						addToast({ message: "Failed to logout", intent: "danger" })
					})
			}}
		>
			<button type="submit" className={link()}>
				Logout
			</button>
		</form>
	)
}
