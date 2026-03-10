import { DateTime } from "luxon"
import { Typography, VStack } from "#/features/ui"

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
			<Typography.Heading as="h1" font="serif" weight="light" leading="tight">
				Good {timeOfDay},{" "}
				<Typography.Inline tone="accent" italic>
					{userName}.
				</Typography.Inline>
			</Typography.Heading>
			{numLikes > 0 && (
				<Typography.Text as="p" font="sans" size="sm" color="stone.500">
					You have {numLikes} new likes on your proposals this week.
				</Typography.Text>
			)}
		</VStack>
	)
}
