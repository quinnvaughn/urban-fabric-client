import { useCallback } from "react"
import { closeModal, openModal } from "#/stores"
import { useCurrentUser } from "./use-current-user"

export function useRequireAuth(title?: string) {
	const { data: userData } = useCurrentUser()

	return useCallback(
		(action: () => void) => {
			if (!userData?.me) {
				openModal("auth", {
					title,
					onAuthSuccess: () => {
						closeModal()
						action()
					},
				})
				return
			}
			action()
		},
		[userData?.me, title],
	)
}
