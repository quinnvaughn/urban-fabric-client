import { Link } from "@tanstack/react-router"
import { MapPin } from "lucide-react"
import { DateTime } from "luxon"
import { Badge, Card, HStack, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Props = {
	lastEdited: string
	title: string
	id: string
	location: string
	// at the moment this is an svg but eventually it will be a url to an image
	mapImage: string
	hasProposal: boolean
}

export function FabricCard({
	lastEdited,
	title,
	location,
	mapImage,
	id,
	hasProposal,
}: Props) {
	console.log("title", title, "has proposal", hasProposal)
	return (
		<Link to="/fabric/$id" params={{ id }}>
			<Card size="sm" lift="md" shadow="sm">
				<Card.Media className={css({ position: "relative" })}>
					<img src={mapImage} alt={`${title} map`} />
					{hasProposal && (
						<Badge
							appearance="solid"
							tone="accent"
							size="xs"
							className={css({ position: "absolute", top: "2", right: "2" })}
						>
							Proposal
						</Badge>
					)}
				</Card.Media>
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
