import { useState } from "react"
import { GETTING_STARTED_SEEN_KEY } from "./getting-started-modal"

export function useGettingStartedNudge() {
	const [showNudge, setShowNudge] = useState(
		() =>
			typeof localStorage !== "undefined" &&
			!localStorage.getItem(GETTING_STARTED_SEEN_KEY),
	)

	function dismissNudge() {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem(GETTING_STARTED_SEEN_KEY, "1")
		}
		setShowNudge(false)
	}

	return { showNudge, dismissNudge }
}
