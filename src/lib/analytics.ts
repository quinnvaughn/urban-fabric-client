import { usePostHog } from "@posthog/react"
import { useCallback } from "react"

export type AuthSource =
	| "comment"
	| "like proposal"
	| "like comment"
	| "sign_in"
	| "save_draft"
	| "publish"
	| "google"
	| "nudge"
	| "follow creator"

// ── Event map ─────────────────────────────────────────────────────────────────

export type EventMap = {
	// Acquisition / Auth
	page_viewed: {
		page:
			| "home"
			| "explore"
			| "proposal"
			| "editor"
			| "publish"
			| "dashboard"
			| "my_proposals"
			| "my_fabrics"
			| "profile"
	}
	signup_started: { source: Exclude<AuthSource, "google"> }
	signup_completed: { source: AuthSource }
	login_completed: undefined

	// Core funnel
	fabric_created: undefined
	draft_saved: undefined
	proposal_published: undefined

	// Explore
	explore_searched: {
		has_location: boolean
		query_length: number
		category_count: number
	}
	explore_sorted: { sort_by: string }

	// Proposal
	proposal_viewed: { proposal_id: string; categories: string[]; embed?: boolean }
	proposal_liked: undefined
	comment_created: {
		proposal_slug: string
		type: "comment" | "reply"
		has_location: boolean
	}
	proposal_share_modal_opened: { source: string }
	proposal_shared: { method: string; source: string }
	proposal_share_modal_dismissed: { source: string }

	// Profile
	profile_share_modal_opened: { source: string }
	profile_shared: { method: string; source: string }
	profile_share_modal_dismissed: { source: string }

	// Editor
	editor_element_added: { element_type: string }
	editor_element_edited: { element_type: string; property: string }
	nudge_shown: undefined
	nudge_dismissed: { via: "keep_editing" | "dismiss_button" }

	// Mobile unsupported screen
	editor_mobile_wall_viewed: undefined
	editor_mobile_explore_clicked: undefined
	editor_mobile_link_copied: undefined
	editor_mobile_email_sent: undefined
	editor_mobile_go_back: undefined
}

type CaptureArgs<K extends keyof EventMap> = EventMap[K] extends undefined
	? [event: K]
	: [event: K, properties: EventMap[K]]

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAnalytics() {
	const posthog = usePostHog()

	const capture = useCallback(
		<K extends keyof EventMap>(
			...[event, properties]: CaptureArgs<K>
		): void => {
			posthog.capture(event, properties as Record<string, unknown> | undefined)
		},
		[posthog],
	)

	return { capture }
}
