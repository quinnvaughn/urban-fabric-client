import { useCallback } from "react"
import { type AuthSource, useAnalytics } from "#/lib/analytics"
import { closeModal, openModal } from "#/stores"
import { useCurrentUser } from "./use-current-user"

export function useRequireAuth(
	title?: string,
	analyticsSource?: Exclude<AuthSource, "google">,
) {
	const { user } = useCurrentUser()
	const { capture } = useAnalytics()

	return useCallback(
		(action: () => void) => {
			if (!user) {
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
		[user, title, analyticsSource, capture],
	)
}
