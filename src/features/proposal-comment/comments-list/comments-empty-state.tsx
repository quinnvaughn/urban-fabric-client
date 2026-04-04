import { MessageSquare } from "lucide-react"
import { Box, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

export function CommentsEmptyState() {
	return (
		<Box
			className={css({
				flex: 1,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				px: "6",
				py: "8",
			})}
		>
			<VStack gap="2" align="center">
				<Box
					className={css({
						width: "10",
						height: "10",
						borderRadius: "full",
						background: "stone.100",
						display: "flex",
						alignItems: "center",
						justify: "center",
						color: "stone.400",
					})}
				>
					<MessageSquare size={18} />
				</Box>
				<Typography.Text
					font="serif"
					weight="light"
					size="2xl"
					lineHeight="snug"
					color="stone.700"
					fontStyle="italic"
				>
					No comments yet.
				</Typography.Text>
				<Typography.Text size="sm" color="stone.500" textAlign="center">
					Be the first to share your thoughts, or pin a note to a specific spot
					on the map.
				</Typography.Text>
			</VStack>
		</Box>
	)
}
