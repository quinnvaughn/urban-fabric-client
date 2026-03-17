import { Link } from "@tanstack/react-router"
import { Copy, EllipsisVertical, MapPin, Trash } from "lucide-react"
import { DateTime } from "luxon"
import {
	Badge,
	Box,
	Card,
	HStack,
	Menu,
	Typography,
	VStack,
} from "#/features/ui"
import { css, cx } from "#/styles/styled-system/css"

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
	return (
		<Box
			className={cx(
				"group",
				css({
					position: "relative",
					animation: "fadeUp 200ms var(--easings-out)",
				}),
			)}
		>
			<Link
				to="/fabric/$id"
				params={{ id }}
				className={css({
					position: "absolute",
					inset: "0",
					zIndex: "base",
				})}
			/>
			<Menu placement="bottom-end">
				<Menu.Trigger>
					<button
						type="button"
						className={css({
							position: "absolute",
							top: "2",
							right: "2",
							padding: "1",
							borderRadius: "full",
							color: "stone.400",
							visibility: "hidden",
							transition: "color 100ms, background 100ms",
							_groupHover: {
								visibility: "visible",
								background: "rgb(255 255 255 / 0.8)",
								_hover: {
									color: "stone.900",
									background: "white",
								},
							},
							zIndex: "floating",
							cursor: "pointer",
						})}
					>
						<EllipsisVertical />
					</button>
				</Menu.Trigger>
				<Menu.Content>
					<Menu.Item>
						<Copy size={12} />
						Duplicate
					</Menu.Item>
					<Menu.Item intent="danger">
						<Trash size={12} />
						Delete
					</Menu.Item>
				</Menu.Content>
			</Menu>
			<Card size="sm" lift="md" shadow="sm">
				<Card.Media>
					<img src={mapImage} alt={`${title} map`} />
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
						<HStack
							gap="1"
							align="end"
							justify="space-between"
							className={css({ minHeight: "6" })}
						>
							<Typography.Text size="xs" color="stone.400">
								Edited {DateTime.fromISO(lastEdited).toFormat("LLL d")}
							</Typography.Text>
							{hasProposal && (
								<Badge appearance="solid" tone="accent" size="xs">
									Proposal
								</Badge>
							)}
						</HStack>
					</VStack>
				</Card.Body>
			</Card>
		</Box>
	)
}
