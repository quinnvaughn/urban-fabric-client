import { useApolloClient, useMutation } from "@apollo/client/react"
import { useNavigate } from "@tanstack/react-router"
import { useCallback, useState } from "react"
import { useToast } from "#/features/ui"
import { LogoutDocument } from "#/graphql/generated"

type LogoutOptions = {
	onBeforeLogout?: () => void | Promise<void>
	onLoggedOut?: () => void | Promise<void>
	redirectTo?: "/"
	replace?: boolean
}

export function useLogout() {
	const [isLoggingOut, setIsLoggingOut] = useState(false)
	const [logoutMutation] = useMutation(LogoutDocument)
	const client = useApolloClient()
	const navigate = useNavigate()
	const { toast } = useToast()

	const logout = useCallback(
		async (options?: LogoutOptions) => {
			if (isLoggingOut) return false

			setIsLoggingOut(true)
			try {
				await options?.onBeforeLogout?.()

				const response = await logoutMutation()
				if (!response.data?.logout) {
					toast({ title: "Unable to log out", intent: "error" })
					return false
				}

				await client.clearStore()
				await options?.onLoggedOut?.()
				await navigate({
					to: options?.redirectTo ?? "/",
					replace: options?.replace ?? true,
				})
				toast({ title: "Logged out", intent: "success" })
				return true
			} catch {
				toast({ title: "Unable to log out", intent: "error" })
				return false
			} finally {
				setIsLoggingOut(false)
			}
		},
		[client, isLoggingOut, logoutMutation, navigate, toast],
	)

	return {
		logout,
		isLoggingOut,
	}
}
