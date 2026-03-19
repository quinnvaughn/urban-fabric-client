import * as React from "react"

export function useTransientText(
	defaultText: string,
	transientText: string,
	duration = 2000,
): [string, () => void] {
	const [active, setActive] = React.useState(false)
	const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null)

	function activate() {
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		setActive(true)
		timeoutRef.current = setTimeout(() => setActive(false), duration)
	}

	React.useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
		}
	}, [])

	return [active ? transientText : defaultText, activate]
}
