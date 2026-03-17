import { Link } from "@tanstack/react-router"
import { Check, EllipsisVertical, ExternalLink, Trash } from "lucide-react"
import { DateTime } from "luxon"
import {
	Badge,
	Box,
	HStack,
	Menu,
	Tooltip,
	Typography,
	VStack,
} from "#/features/ui"
import { css, cva, cx } from "#/styles/styled-system/css"

type Props = {
	mapImage: string
	isPublished: boolean
	title: string
	location: string
	date: string
	views?: number
	likes: number
	slug: string
}

function toCapitalized(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

const actionButton = cva({
	base: {
		width: "30px",
		height: "30px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: "md",
		background: "none",
		color: "stone.400",
		transition: "background-color 150ms, color 150ms",
		flexShrink: 0,
		cursor: "pointer",
	},
	variants: {
		type: {
			view: {
				_hover: {
					color: "teal.600",
					background: "teal.50",
				},
			},
			menu: {
				_hover: {
					color: "stone.600",
					background: "stone.100",
				},
			},
		},
	},
	defaultVariants: {
		type: "view",
	},
})

export function ProposalRow({
	mapImage,
	isPublished,
	title,
	location,
	date,
	views,
	likes,
	slug,
}: Props) {
	return (
		<Box
			className={cx(
				"group",
				css({
					position: "relative",
					animation: "fadeUp 200ms var(--easings-out)",
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
					transition: "box-shadow 200ms, transform 200ms, border-color 200ms",
					_hover: {
						boxShadow: "md",
						transform: "translateY(-1px)",
						borderColor: "stone.300",
					},
				}),
			)}
		>
			{/* Stretched link covers the whole card; sits behind interactive children */}
			<Link
				to="/proposal/$slug/edit"
				params={{ slug }}
				aria-label={`Edit ${title}`}
				className={css({
					position: "absolute",
					inset: "0",
					zIndex: "0",
				})}
			/>
			<Box
				className={css({
					width: "20",
					alignSelf: "stretch",
					flexShrink: "0",
					background: "stone.100",
					overflow: "hidden",
				})}
			>
				<img
					src={mapImage}
					alt={title}
					className={css({ width: "100%", height: "100%", objectFit: "cover" })}
				/>
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
					<Badge tone={isPublished ? "brand" : "muted"} size="xs">
						{isPublished && <Check size={12} />}
						{toCapitalized(isPublished ? "published" : "draft")}
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
				<Stat label="Views" value={views} isPublished={isPublished} />
				<Stat label="Likes" value={likes} isPublished={isPublished} />
			</Box>
			<Box
				className={css({
					position: "relative",
					zIndex: "1",
					display: "flex",
					alignItems: "center",
					gap: "0.5",
					paddingRight: "3",
					flexShrink: 0,
					opacity: { base: 0, _groupHover: 1 },
					transition: "opacity 150ms var(--easings-in-out)",
				})}
			>
				{isPublished ? (
					<Tooltip>
						<Tooltip.Trigger>
							<Link
								to="/proposal/$slug"
								params={{ slug }}
								className={actionButton({ type: "view" })}
								aria-label={`View ${title}`}
							>
								<ExternalLink size={16} />
							</Link>
						</Tooltip.Trigger>
						<Tooltip.Content>View proposal</Tooltip.Content>
					</Tooltip>
				) : (
					<div />
				)}
				<Menu>
					<Menu.Trigger>
						<button type="button" className={actionButton({ type: "menu" })}>
							<EllipsisVertical size={16} />
						</button>
					</Menu.Trigger>
					<Menu.Content>
						<Menu.Item intent="danger">
							<Trash size={16} /> Delete
						</Menu.Item>
					</Menu.Content>
				</Menu>
			</Box>
		</Box>
	)
}

type StatProps = {
	label: string
	value?: number
	isPublished: boolean
}

function Stat({ label, value, isPublished }: StatProps) {
	return (
		<VStack gap="px" align="center" className={css({ minWidth: "11" })}>
			<Typography.Text
				size="sm"
				weight="bold"
				leading={"none"}
				color={isPublished ? "stone.900" : "stone.400"}
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
