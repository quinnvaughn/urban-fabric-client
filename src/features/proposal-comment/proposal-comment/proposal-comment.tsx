import { Heart } from "lucide-react"
import { DateTime } from "luxon"
import { Avatar, Box, HStack, Typography, VStack } from "#/features/ui"
import type { CommentCardFragment } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"

type Props = {
	comment: CommentCardFragment
}

export function ProposalComment({ comment }: Props) {
	return (
		<Box
			className={css({
				px: "5",
				py: "3.5",
				borderBottom: "1px solid",
				borderBottomColor: {
					base: "border.subtle",
					_last: "transparent",
				},
				transition: "background 120ms",
			})}
		>
			<VStack gap="2">
				<HStack gap="2" align="start">
					<Avatar name={comment.user.name} size="xs" />
					<Box
						className={css({
							flex: 1,
							minW: 0,
							display: "flex",
							alignItems: "baseline",
							gap: "2",
						})}
					>
						<Typography.Text size="sm" weight="semibold" color="stone.800">
							{comment.user.name}
						</Typography.Text>
						<Typography.Text size="xs" color="stone.400">
							{DateTime.fromISO(comment.createdAt).toRelative()}
						</Typography.Text>
					</Box>
				</HStack>
				<Box className={css({ paddingLeft: "8" })}>
					<Typography.Text
						size="md"
						color="stone.700"
						lineHeight="relaxed"
						whiteSpace="pre-wrap"
					>
						{comment.body}
					</Typography.Text>
				</Box>
				<HStack gap="3" align="center" className={css({ paddingLeft: "8" })}>
					<button
						type="button"
						className={css({
							display: "inline-flex",
							gap: "1",
							alignItems: "center",
							color: { base: "stone.400", _hover: "stone.700" },
							cursor: "pointer",
							fontSize: "xs",
							fontWeight: "medium",
							background: "none",
							transition: "color 150ms",
							padding: "2px 0",
						})}
					>
						<Heart size={12} />
						<span>{comment.likeCount}</span>
					</button>
					<button
						type="button"
						className={css({
							display: "inline-flex",
							gap: "1",
							alignItems: "center",
							color: { base: "stone.400", _hover: "stone.700" },
							cursor: "pointer",
							fontSize: "xs",
							fontWeight: "medium",
							background: "none",
							transition: "color 150ms",
							padding: "2px 0",
						})}
					>
						Reply
					</button>
				</HStack>
			</VStack>
		</Box>
	)
}
