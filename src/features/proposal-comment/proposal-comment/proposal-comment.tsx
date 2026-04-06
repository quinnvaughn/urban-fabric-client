import { ChevronRight, ChevronUp, Trash } from "lucide-react"
import { DateTime } from "luxon"
import { Suspense, useEffect, useRef, useState } from "react"
import { match } from "ts-pattern"
import { Avatar, Box, Button, HStack, Typography, VStack } from "#/features/ui"
import type { CommentCardFragment } from "#/graphql/generated"
import { useCurrentUser } from "#/lib/graphql"
import { singularOrPlural } from "#/lib/string"
import { css } from "#/styles/styled-system/css"
import { useCommentComposerStore } from "../comment-composer-store"
import { useCommentEditStore } from "../comment-edit-store"
import { CommentsLoadingState } from "../comments-panel/comments-loading-state"
import { CommentActions } from "./comment-actions"
import { EditableCommentBody } from "./editable-comment-body"
import { LikeCommentButton } from "./like-comment-button"
import { ProposalCommentReplies } from "./proposal-comment-replies"
import { ShowLocationPinButton } from "./show-location-pin-button"
import { useDeleteProposalComment } from "./use-delete-proposal-comment"
import { useUpdateProposalComment } from "./use-update-proposal-comment"

type Props = {
	comment: CommentCardFragment
	slug: string
	readOnly?: boolean
}

export function ProposalComment({ comment, slug, readOnly = false }: Props) {
	const [showReplies, setShowReplies] = useState(false)
	const [isFreshlyAdded, setIsFreshlyAdded] = useState(false)
	const commentRef = useRef<HTMLDivElement | null>(null)
	const { user } = useCurrentUser()
	const { startEditing } = useCommentEditStore()
	const updateProposalComment = useUpdateProposalComment()
	const deleteProposalComment = useDeleteProposalComment()
	const { pendingScrollTarget, setReplyTarget, clearPendingScrollTarget } =
		useCommentComposerStore()
	const isDeleted = Boolean(comment.deletedAt)
	const isEdited = Boolean(comment.editedAt)

	useEffect(() => {
		if (pendingScrollTarget?.parentId === comment.id) {
			setShowReplies(true)
		}
	}, [comment.id, pendingScrollTarget?.parentId])

	useEffect(() => {
		if (pendingScrollTarget?.commentId !== comment.id) return

		requestAnimationFrame(() => {
			setIsFreshlyAdded(true)
			commentRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			})
			clearPendingScrollTarget()
		})
	}, [clearPendingScrollTarget, comment.id, pendingScrollTarget?.commentId])

	useEffect(() => {
		if (!isFreshlyAdded) return

		const timeoutId = window.setTimeout(() => {
			setIsFreshlyAdded(false)
		}, 1800)

		return () => {
			window.clearTimeout(timeoutId)
		}
	}, [isFreshlyAdded])

	async function handleSaveEditedComment(body: string) {
		return updateProposalComment(comment.id, body)
	}

	async function handleDeleteComment() {
		return deleteProposalComment({ id: comment.id, proposalSlug: slug })
	}

	return (
		<Box
			ref={commentRef}
			id={`proposal-comment-${comment.id}`}
			className={css({
				px: "5",
				py: "3.5",
				borderBottom: "1px solid",
				borderBottomColor: "border.subtle",
				backgroundColor: isFreshlyAdded ? "teal.50" : "transparent",
				transition: "background-color 1.8s ease",
			})}
		>
			<VStack gap="2">
				<HStack gap="2" align="start">
					<Avatar name={comment.user.name} size="xs" />
					<VStack gap="1" align="start" fullWidth>
						<Box
							className={css({
								flex: 1,
								width: "full",
								display: "flex",
								alignItems: "center",
								gap: "2",
							})}
						>
							<Typography.Text size="sm" weight="semibold" color="stone.800">
								{comment.user.name}
							</Typography.Text>
							<HStack gap="1.5" className={css({ flex: 1 })}>
								<Typography.Text size="xs" color="stone.400">
									{DateTime.fromISO(comment.createdAt).toRelative()}
								</Typography.Text>
								{!isDeleted && isEdited && (
									<Typography.Text size="xs" color="stone.400">
										(edited)
									</Typography.Text>
								)}
							</HStack>
							{!readOnly && !isDeleted && comment.user.id === user?.id && (
								<CommentActions
									onEdit={() =>
										startEditing(
											{
												id: comment.id,
												kind: "comment",
											},
											comment.body,
										)
									}
									onDelete={() => void handleDeleteComment()}
								/>
							)}
						</Box>
						{!isDeleted && comment.location && (
							<ShowLocationPinButton
								commentId={comment.id}
								location={comment.location}
							/>
						)}
					</VStack>
				</HStack>
				<Box className={css({ paddingLeft: "8" })}>
					{isDeleted ? (
						<HStack gap="2" className={css({ color: "stone.500" })}>
							<Trash size={14} />
							<Typography.Text
								size="sm"
								color="stone.500"
								lineHeight="relaxed"
								whiteSpace="pre-wrap"
							>
								Comment deleted
							</Typography.Text>
						</HStack>
					) : (
						<EditableCommentBody
							id={comment.id}
							body={comment.body}
							onSave={handleSaveEditedComment}
						/>
					)}
				</Box>
				<HStack gap="3" align="center" className={css({ paddingLeft: "8" })}>
					{!readOnly && !isDeleted && <LikeCommentButton comment={comment} />}
					{!readOnly && !isDeleted && (
						<Button
							size="xs"
							appearance="ghost"
							intent="neutral"
							onClick={() =>
								setReplyTarget({
									commentId: comment.id,
									displayName: comment.user.name,
								})
							}
						>
							Reply
						</Button>
					)}
					{comment.replyCount > 0 && (
						<Button
							size="xs"
							type="button"
							appearance="ghost"
							onClick={() => setShowReplies((prev) => !prev)}
						>
							{showReplies ? (
								<ChevronUp size={12} />
							) : (
								<ChevronRight size={12} />
							)}
							{match(showReplies)
								.with(
									true,
									() =>
										`Hide ${singularOrPlural("reply", "replies", comment.replyCount)}`,
								)
								.with(
									false,
									() =>
										`${comment.replyCount} ${singularOrPlural("reply", "replies", comment.replyCount)}`,
								)
								.exhaustive()}
						</Button>
					)}
				</HStack>
				{showReplies && (
					<Suspense fallback={<CommentsLoadingState count={2} isReplies />}>
						<ProposalCommentReplies
							commentId={comment.id}
							readOnly={readOnly}
						/>
					</Suspense>
				)}
			</VStack>
		</Box>
	)
}
