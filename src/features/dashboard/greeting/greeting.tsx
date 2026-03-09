import { DateTime } from "luxon"

type Props = {
	userName: string
}

function getTimeOfDay(): string {
	const hour = DateTime.local().hour
	if (hour < 12) {
		return "morning"
	} else if (hour < 18) {
		return "afternoon"
	} else {
		return "evening"
	}
}

export function Greeting({ userName }: Props) {
	const timeOfDay = getTimeOfDay()
	return (
		<div>
			Good {timeOfDay}, {userName}!
		</div>
	)
}
