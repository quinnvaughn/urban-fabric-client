import { Link } from "@tanstack/react-router"
import type { LucideIcon } from "lucide-react"
import { Box, Typography, VStack } from "#/features/ui"
import { css, cx } from "#/styles/styled-system/css"
import { vstack } from "#/styles/styled-system/patterns"
import { button } from "#/styles/styled-system/recipes"

type Props = {
	icon: LucideIcon
	iconSize?: number
	title: string
	description: string
	actionIcon: LucideIcon
	actionLabel: string
	actionTo: string
}

export function EmptyState({
	icon: Icon,
	iconSize = 22,
	title,
	description,
	actionIcon: ActionIcon,
	actionLabel,
	actionTo,
}: Props) {
	return (
		<Box
			className={cx(
				vstack(),
				css({
					paddingTop: "16",
					paddingBottom: "12",
					px: "6",
				}),
			)}
		>
			<VStack gap="6" align="center">
				<VStack gap="2" align="center" className={css({ maxWidth: "300px" })}>
					<VStack gap="5" align="center">
						<Box
							className={css({
								w: "52px",
								h: "52px",
								background: "stone.200",
								borderRadius: "full",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "stone.400",
							})}
						>
							<Icon size={iconSize} />
						</Box>
						<Typography.Text
							font="serif"
							weight="light"
							size="2xl"
							lineHeight="snug"
							color="stone.700"
							fontStyle="italic"
						>
							{title}
						</Typography.Text>
					</VStack>
					<Typography.Text size="md" color="stone.400" textAlign="center">
						{description}
					</Typography.Text>
				</VStack>
				<Link className={button({ intent: "brand" })} to={actionTo}>
					<ActionIcon size={14} /> {actionLabel}
				</Link>
			</VStack>
		</Box>
	)
}
