import { Link } from "@tanstack/react-router"
import { MapPin } from "lucide-react"
import { DateTime } from "luxon"
import { Card, HStack, Typography, VStack } from "#/features/ui"

type Props = {
	lastEdited: string
	title: string
	id: string
	location: string
	// at the moment this is an svg but eventually it will be a url to an image
	mapImage: React.ReactNode
}

export function FabricCard({
	lastEdited,
	title,
	location,
	mapImage,
	id,
}: Props) {
	return (
		<Link to="/fabric/$id" params={{ id }}>
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
						<HStack gap="1" align="center">
							<MapPin size={12} color={"var(--colors-stone-400)"} />
							<Typography.Text size="xs" color="stone.400">
								{location}
							</Typography.Text>
						</HStack>
						<Typography.Text size="xs" color="stone.400">
							Edited {DateTime.fromISO(lastEdited).toFormat("LLL d")}
						</Typography.Text>
					</VStack>
				</Card.Body>
			</Card>
		</Link>
	)
}
