import { Heart } from "lucide-react"
import { DateTime } from "luxon"
import { Avatar, Box, Button, HStack, Typography, VStack } from "#/features/ui"
import type { CommentCardFragment } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { useCommentComposerStore } from "../comment-composer-store"

type Props = {
	reply: CommentCardFragment
}

export function CommentReply({ reply }: Props) {
	const { setReplyTarget } = useCommentComposerStore()
	return (
		<Box
			className={css({
				py: "2.5",
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
					<Avatar name={reply.user.name} size="xs" />
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
							{reply.user.name}
						</Typography.Text>
						<Typography.Text size="xs" color="stone.400">
							{DateTime.fromISO(reply.createdAt).toRelative()}
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
						{reply.body}
					</Typography.Text>
				</Box>
				<HStack gap="3" align="center" className={css({ paddingLeft: "8" })}>
					<Button size="xs" appearance="ghost">
						<Heart size={12} />
						<span>{reply.likeCount}</span>
					</Button>
					<Button
						size="xs"
						appearance="ghost"
						intent="neutral"
						onClick={() =>
							setReplyTarget({
								commentId: reply.id,
								displayName: reply.user.name,
							})
						}
					>
						Reply
					</Button>
				</HStack>
			</VStack>
		</Box>
	)
}
