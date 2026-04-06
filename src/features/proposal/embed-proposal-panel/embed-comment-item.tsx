import { DateTime } from "luxon"
import { Avatar, Box, Typography, VStack } from "#/features/ui"
import type { CommentCardFragment } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"

export function EmbedCommentItem({
	comment,
}: {
	comment: CommentCardFragment
}) {
	const isDeleted = Boolean(comment.deletedAt)
	const isEdited = Boolean(comment.editedAt)

	return (
		<Box
			id={`proposal-comment-${comment.id}`}
			className={css({
				px: "5",
				py: "3.5",
				borderBottom: "1px solid",
				borderBottomColor: "border.subtle",
			})}
		>
			<VStack gap="2.5" align="start">
				<Box
					className={css({
						width: "full",
						display: "flex",
						alignItems: "start",
						justifyContent: "space-between",
						gap: "3",
					})}
				>
					<Box
						className={css({
							display: "flex",
							alignItems: "center",
							gap: "2",
							minWidth: 0,
							flex: 1,
						})}
					>
						<Avatar name={comment.user.name} size="xs" />
						<Typography.Text size="sm" weight="semibold" color="stone.800">
							{comment.user.name}
						</Typography.Text>
					</Box>
					<Typography.Text
						size="xs"
						color="stone.400"
						className={css({ flexShrink: 0 })}
					>
						{DateTime.fromISO(comment.createdAt).toRelative()}
					</Typography.Text>
				</Box>
				<Typography.Text
					size="md"
					color={isDeleted ? "stone.500" : "stone.700"}
					lineHeight="relaxed"
					className={css({ whiteSpace: "pre-wrap" })}
				>
					{isDeleted ? "Comment deleted" : comment.body}
				</Typography.Text>
				{!isDeleted && isEdited && (
					<Typography.Text size="xs" color="stone.400">
						Edited
					</Typography.Text>
				)}
				{!isDeleted && comment.location && (
					<Box
						className={css({
							display: "inline-flex",
							alignItems: "center",
							border: "1px solid",
							borderColor: "teal.200",
							borderRadius: "full",
							color: "teal.700",
							fontSize: "sm",
							fontWeight: "medium",
							lineHeight: "1",
							px: "3",
							py: "1.5",
						})}
					>
						{comment.location.name}
					</Box>
				)}
			</VStack>
		</Box>
	)
}
