import { DateTime } from "luxon"

export function formatTimeAgo(date: string): string {
	return (
		DateTime.fromISO(date).toRelative({
			round: true,
			base: DateTime.now(),
		}) ?? ""
	)
}
