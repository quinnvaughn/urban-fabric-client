import { DateTime } from "luxon"
import { Card, Typography, VStack } from "#/features/ui"

type Props = {
	lastEdited: string
	title: string
	// at the moment this is an svg but eventually it will be a url to an image
	mapImage: React.ReactNode
}

export function FabricCard({ lastEdited, title, mapImage }: Props) {
	return (
		<Card size="sm" lift="md" shadow="sm">
			<Card.Media>{mapImage}</Card.Media>
			<Card.Body>
				<VStack gap="1">
					<Typography.Text
						size="sm"
						weight="semibold"
						leading="normal"
						clamp={"2"}
					>
						{title}
					</Typography.Text>
					<Typography.Text size="xs" color="stone.400">
						{DateTime.fromISO(lastEdited).toFormat("LLL d")}
					</Typography.Text>
				</VStack>
			</Card.Body>
		</Card>
	)
}
