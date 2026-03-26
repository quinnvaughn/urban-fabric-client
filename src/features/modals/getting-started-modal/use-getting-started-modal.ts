import { useEffect } from "react"
import { openModal } from "#/stores"
import { GETTING_STARTED_SEEN_KEY } from "./getting-started-modal"

export function useGettingStartedModal() {
	useEffect(() => {
		if (localStorage.getItem(GETTING_STARTED_SEEN_KEY)) return
		const timer = setTimeout(() => openModal("gettingStarted"), 600)
		return () => clearTimeout(timer)
	}, [])
}
