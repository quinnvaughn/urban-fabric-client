import { Link } from "@tanstack/react-router"
import { Trash } from "lucide-react"
import { DateTime } from "luxon"
import { useEffect, useRef, useState } from "react"
import { Avatar, Box, Button, HStack, Typography, VStack } from "#/features/ui"
import type { ReplyCardFragment } from "#/graphql/generated"
import { useCurrentUser } from "#/lib/graphql"
import { css } from "#/styles/styled-system/css"
import { useCommentComposerStore } from "../comment-composer-store"
import { useCommentEditStore } from "../comment-edit-store"
import { CommentActions } from "./comment-actions"
import { EditableCommentBody } from "./editable-comment-body"
import { LikeCommentButton } from "./like-comment-button"
import { ShowLocationPinButton } from "./show-location-pin-button"
import { useDeleteProposalComment } from "./use-delete-proposal-comment"
import { useUpdateProposalComment } from "./use-update-proposal-comment"

type Props = {
	reply: ReplyCardFragment
	readOnly?: boolean
}

export function CommentReply({ reply, readOnly = false }: Props) {
	const [isFreshlyAdded, setIsFreshlyAdded] = useState(false)
	const replyRef = useRef<HTMLDivElement | null>(null)
	const { pendingScrollTarget, setReplyTarget, clearPendingScrollTarget } =
		useCommentComposerStore()
	const { startEditing } = useCommentEditStore()
	const updateProposalComment = useUpdateProposalComment()
	const deleteProposalComment = useDeleteProposalComment()
	const { user } = useCurrentUser()
	const isDeleted = Boolean(reply.deletedAt)
	const isEdited = Boolean(reply.editedAt)

	useEffect(() => {
		if (pendingScrollTarget?.commentId !== reply.id) return

		requestAnimationFrame(() => {
			setIsFreshlyAdded(true)
			replyRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			})
			clearPendingScrollTarget()
		})
	}, [clearPendingScrollTarget, pendingScrollTarget?.commentId, reply.id])

	useEffect(() => {
		if (!isFreshlyAdded) return

		const timeoutId = window.setTimeout(() => {
			setIsFreshlyAdded(false)
		}, 1800)

		return () => {
			window.clearTimeout(timeoutId)
		}
	}, [isFreshlyAdded])

	async function handleSaveEditedReply(body: string) {
		return updateProposalComment(reply.id, body)
	}

	async function handleDeleteReply() {
		return deleteProposalComment({ id: reply.id, parentId: reply.parent?.id })
	}

	return (
		<Box
			ref={replyRef}
			id={`proposal-comment-${reply.id}`}
			className={css({
				py: "2.5",
				borderBottom: "1px solid",
				borderBottomColor: {
					base: "border.subtle",
					_last: "transparent",
				},
				backgroundColor: isFreshlyAdded ? "teal.50" : "transparent",
				transition: "background-color 1.8s ease",
			})}
		>
			<VStack gap="2">
				<HStack gap="2" align="start">
					<Avatar
						profilePictureUrl={reply.user.profilePictureUrl}
						name={reply.user.name}
						size="sm"
					/>
					<VStack gap="1" align="start" fullWidth>
						<Box
							className={css({
								flex: 1,
								display: "flex",
								alignItems: "center",
								gap: "2",
								width: "full",
							})}
						>
							<Link
								to={user?.id ? "/dashboard/user/$username" : "/user/$username"}
								params={{ username: reply.user.username }}
								className={css({
									fontSize: "sm",
									fontWeight: "semibold",
									color: { base: "stone.800", _hover: "brand.default" },
									_hover: { textDecoration: "underline" },
								})}
							>
								{reply.user.name}
							</Link>
							<HStack gap="1.5" className={css({ flex: 1 })}>
								<Typography.Text size="xs" color="stone.400">
									{DateTime.fromISO(reply.createdAt).toRelative()}
								</Typography.Text>
								{!isDeleted && isEdited && (
									<Typography.Text size="xs" color="stone.400">
										(edited)
									</Typography.Text>
								)}
							</HStack>
							{!readOnly && !isDeleted && reply.user.id === user?.id && (
								<CommentActions
									onEdit={() =>
										startEditing(
											{
												id: reply.id,
												kind: "reply",
												parentId: reply.parent?.id,
											},
											reply.body,
										)
									}
									onDelete={() => void handleDeleteReply()}
								/>
							)}
						</Box>
						{!isDeleted && reply.location && (
							<ShowLocationPinButton
								commentId={reply.id}
								location={reply.location}
							/>
						)}
					</VStack>
				</HStack>
				<Box className={css({ paddingLeft: "8" })}>
					{isDeleted ? (
						<HStack gap="2" className={css({ color: "stone.500" })}>
							<Trash size={14} />
							<Typography.Text size="sm" color="stone.500" lineHeight="relaxed">
								Comment deleted
							</Typography.Text>
						</HStack>
					) : (
						<EditableCommentBody
							id={reply.id}
							body={reply.body}
							prefix={
								reply.replyToComment
									? `@${reply.replyToComment.user.name} `
									: undefined
							}
							onSave={handleSaveEditedReply}
						/>
					)}
				</Box>
				<HStack gap="3" align="center" className={css({ paddingLeft: "8" })}>
					{!readOnly && !isDeleted && <LikeCommentButton comment={reply} />}
					{!readOnly && !isDeleted && (
						<Button
							size="xs"
							appearance="ghost"
							intent="neutral"
							onClick={() =>
								setReplyTarget({
									commentId: reply.id,
									displayName: reply.user.name,
									replyToUser: {
										__typename: "User",
										id: reply.user.id,
										name: reply.user.name,
									},
								})
							}
						>
							Reply
						</Button>
					)}
				</HStack>
			</VStack>
		</Box>
	)
}
