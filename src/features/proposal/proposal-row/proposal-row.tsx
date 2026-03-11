import { Check, ChevronRight } from "lucide-react"
import { DateTime } from "luxon"
import { Badge, Box, HStack, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Props = {
	// will eventually be a url, for now an svg
	mapImage: React.ReactNode
	status: "published" | "draft"
	title: string
	location: string
	date: string
	views?: number
	likes?: number
}

function toCapitalized(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export function ProposalRow({
	mapImage,
	status,
	title,
	location,
	date,
	views,
	likes,
}: Props) {
	return (
		<Box
			className={css({
				background: "white",
				borderWidth: "1",
				borderStyle: "solid",
				borderColor: "stone.200",
				display: "flex",
				alignItems: "center",
				borderRadius: "lg",
				gap: "0",
				overflow: "hidden",
				boxShadow: "sm",
				cursor: "pointer",
				transition: "box-shadow 200ms, transform 200ms, border-color 200ms",
				_hover: {
					boxShadow: "md",
					transform: "translateY(-1px)",
					borderColor: "stone.300",
				},
			})}
		>
			<Box
				className={css({
					width: "20",
					height: "16",
					flexShrink: "0",
					background: "stone.100",
					overflow: "hidden",
				})}
			>
				{mapImage}
			</Box>
			<Box
				className={css({
					flex: "1",
					py: "2.5",
					px: "4",
				})}
			>
				<Typography.Text size="sm" weight="semibold" truncate>
					{title}
				</Typography.Text>
				<HStack align="center" gap="2.5">
					<Badge tone={status === "published" ? "brand" : "muted"} size="xs">
						{status === "published" && <Check size={12} />}
						{toCapitalized(status)}
					</Badge>
					<Typography.Text size="xs" tone="subtle">
						{location}
					</Typography.Text>
					<Typography.Text size="xs" tone="subtle">
						·
					</Typography.Text>
					<Typography.Text size="xs" tone="subtle">
						{DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}
					</Typography.Text>
				</HStack>
			</Box>
			<Box
				className={css({
					display: "flex",
					alignItems: "center",
					gap: "4",
					py: "3",
					paddingRight: "5",
					paddingLeft: "2",
					flexShrink: "0",
				})}
			>
				<Stat label="Views" value={views} status={status} />
				<Stat label="Likes" value={likes} status={status} />
			</Box>
			<Box className={css({ paddingRight: "3.5", flexShrink: "0" })}>
				<ChevronRight
					size={14}
					className={css({
						color: "stone.400",
					})}
				/>
			</Box>
		</Box>
	)
}

type StatProps = {
	label: string
	value?: number
	status: "published" | "draft"
}

function Stat({ label, value, status }: StatProps) {
	return (
		<VStack gap="px" align="center" className={css({ minWidth: "11" })}>
			<Typography.Text
				size="sm"
				weight="bold"
				leading={"none"}
				color={status === "published" ? "stone.900" : "stone.400"}
			>
				{value != null
					? new Intl.NumberFormat("en-US", { notation: "compact" }).format(
							value,
						)
					: "—"}
			</Typography.Text>
			<Typography.Text
				size="xxs"
				tracking="wider"
				weight="normal"
				transform="uppercase"
				color="stone.400"
			>
				{label}
			</Typography.Text>
		</VStack>
	)
}
