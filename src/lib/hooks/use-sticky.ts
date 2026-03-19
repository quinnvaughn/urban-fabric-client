import { useEffect, useRef, useState } from "react"

export function useSticky() {
	const sentinelRef = useRef<HTMLDivElement>(null)
	const [isStuck, setIsStuck] = useState(false)

	useEffect(() => {
		const sentinel = sentinelRef.current
		if (!sentinel) return

		const observer = new IntersectionObserver(
			([entry]) => setIsStuck(!entry.isIntersecting),
			{ threshold: [1] },
		)

		observer.observe(sentinel)
		return () => observer.disconnect()
	}, [])

	return { sentinelRef, isStuck }
}
