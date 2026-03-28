import { useCallback } from "react"
import { useAnalytics } from "#/lib/analytics"
import { closeModal, openModal } from "#/stores"
import { useCurrentUser } from "./use-current-user"

export function useRequireAuth(title?: string, analyticsSource?: "like") {
	const { data: userData } = useCurrentUser()
	const { capture } = useAnalytics()

	return useCallback(
		(action: () => void) => {
			if (!userData?.me) {
				if (analyticsSource) {
					capture("signup_started", { source: analyticsSource })
				}
				openModal("auth", {
					title,
					source: analyticsSource,
					onAuthSuccess: () => {
						closeModal()
						action()
					},
				})
				return
			}
			action()
		},
		[userData?.me, title, analyticsSource, capture],
	)
}
