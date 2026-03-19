import { DateTime } from "luxon"
import { Typography, VStack } from "#/features/ui"
import { singularOrPlural } from "#/lib/string"

type Props = {
	userName: string
	numLikes: number
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

export function Greeting({ userName, numLikes }: Props) {
	const timeOfDay = getTimeOfDay()
	return (
		<VStack gap="1">
			<Typography.Heading as="h1" font="serif" weight="light" lineHeight="tight">
				Good {timeOfDay},{" "}
				<Typography.Inline tone="accent" fontStyle="italic">
					{userName}.
				</Typography.Inline>
			</Typography.Heading>
			{numLikes > 0 && (
				<Typography.Text as="p" font="sans" size="sm" color="stone.500">
					You have {numLikes} {singularOrPlural("like", "likes", numLikes)} new
					likes on your proposals this week.
				</Typography.Text>
			)}
		</VStack>
	)
}
