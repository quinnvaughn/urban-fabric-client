import { DateTime } from "luxon"
import { Typography, VStack } from "#/features/ui"
import { singularOrPlural } from "#/lib/string"

type Props = {
	userName: string
	numLikes: number
	hasFabrics: boolean
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

export function Greeting({ userName, numLikes, hasFabrics }: Props) {
	if (!hasFabrics) {
		return (
			<VStack gap="1">
				<Typography.Heading
					as="h1"
					font="serif"
					weight="light"
					lineHeight="tight"
					size="lg"
				>
					Welcome to Urban Fabric,{" "}
					<Typography.Inline tone="accent" fontStyle="italic">
						{userName}.
					</Typography.Inline>
				</Typography.Heading>
				<Typography.Text as="p" font="sans" size="md" color="stone.500">
					Let's get your first street redesign on the map.
				</Typography.Text>
			</VStack>
		)
	}

	const timeOfDay = getTimeOfDay()
	return (
		<VStack gap="1">
			<Typography.Heading
				as="h1"
				font="serif"
				weight="light"
				lineHeight="tight"
			>
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
