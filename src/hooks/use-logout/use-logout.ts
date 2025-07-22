import { useApolloClient, useMutation } from "@apollo/client/index.js"
import { useNavigate } from "@tanstack/react-router"
import { LogoutDocument } from "../../graphql/generated"
import { useToast } from "../use-toast"

export function useLogout() {
	const [logout] = useMutation(LogoutDocument)
	const client = useApolloClient()
	const navigate = useNavigate()
	const { addToast } = useToast()

	return async () => {
		try {
			await logout()
			await client.resetStore()
			navigate({ to: "/" })
			addToast({
				message: "Logged out successfully",
				intent: "success",
			})
		} catch {
			addToast({
				message: "Logout failed",
				intent: "danger",
			})
		}
	}
}
