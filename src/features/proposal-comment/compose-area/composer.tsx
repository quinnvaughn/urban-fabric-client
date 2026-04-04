import { useMutation } from "@apollo/client/react"
import {
	type KeyboardEvent,
	useEffect,
	useRef,
	useState,
	useTransition,
} from "react"
import { Box, Button } from "#/features/ui"
import {
	CreateProposalCommentDocument,
	GetProposalDocument,
	ProposalCommentRepliesDocument,
	ProposalCommentsDocument,
} from "#/graphql/generated"
import { useAnalytics } from "#/lib/analytics"
import { useCurrentUser, useRequireAuth } from "#/lib/graphql"
import { sva } from "@/styles/styled-system/css"
import { useCommentComposerStore } from "../comment-composer-store"
import { AddLocationButton } from "./add-location-button"

const composer = sva({
	slots: ["root", "inputWrap", "mentionChip", "textarea", "footer"],
	base: {
		root: {
			borderRadius: "lg",
			borderWidth: "1",
			borderStyle: "solid",
			borderColor: "border.default",
			bg: "white",
			transition:
				"border-color 160ms {easings.inOut}, box-shadow 160ms {easings.inOut}",
			"&[data-focused]": {
				borderColor: "teal.500",
				boxShadow: "0 0 0 3px token(colors.teal.100)",
			},
			"&[data-auth-gate]": {
				cursor: "pointer",
				_hover: { borderColor: "border.strong" },
			},
		},
		inputWrap: {
			position: "relative",
			px: "3",
			pt: "2.5",
			pb: "2.5",
		},
		mentionChip: {
			display: "inline-flex",
			alignItems: "center",
			maxWidth: "full",
			borderRadius: "full",
			bg: "teal.50",
			borderWidth: "1",
			borderStyle: "solid",
			borderColor: "teal.200",
			color: "teal.700",
			fontSize: "sm",
			fontWeight: "medium",
			pl: "2.5",
			pr: "2.5",
			py: "0.5",
			position: "absolute",
			top: "2.5",
			left: "3",
			pointerEvents: "none",
			zIndex: 1,
		},
		textarea: {
			width: "full",
			minHeight: "16",
			maxHeight: "40",
			border: "none",
			outline: "none",
			background: "transparent",
			resize: "none",
			font: "sans",
			fontSize: "md",
			lineHeight: "relaxed",
			color: "fg.default",
			py: "0",
			px: "0",
			_placeholder: { color: "stone.400" },
		},
		footer: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			width: "full",
			gap: "2",
			px: "2.5",
			py: "2",
			borderTopWidth: "1",
			borderTopStyle: "solid",
			borderTopColor: "stone.100",
		},
	},
})

type Props = {
	slug: string
}

export function CommentComposer({ slug }: Props) {
	const { user } = useCurrentUser()
	const { capture } = useAnalytics()
	const {
		replyTarget,
		draftBody,
		setDraftBody,
		pendingLocation,
		setReplyTarget,
		setPendingScrollTarget,
		clearCommentComposer,
	} = useCommentComposerStore()
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
	const mentionChipRef = useRef<HTMLDivElement | null>(null)
	const [createComment] = useMutation(CreateProposalCommentDocument)
	const [isPending, startTransition] = useTransition()
	const [mentionIndent, setMentionIndent] = useState(0)

	const isSignedIn = Boolean(user)
	const [focused, setFocused] = useState(false)
	const requireAuth = useRequireAuth(
		"Create an account or sign in to comment",
		"comment",
	)
	const slots = composer()

	function handleClick() {
		return requireAuth(() => {})
	}

	function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (
			event.key === "Backspace" &&
			!draftBody &&
			replyTarget?.replyToUser &&
			event.currentTarget.selectionStart === 0 &&
			event.currentTarget.selectionEnd === 0
		) {
			event.preventDefault()
			setReplyTarget(null)
		}
	}

	useEffect(() => {
		if (replyTarget && textAreaRef.current) textAreaRef.current.focus()
	}, [replyTarget])

	useEffect(() => {
		if (!replyTarget?.replyToUser) {
			setMentionIndent(0)
			return
		}

		function updateMentionIndent() {
			const chipWidth = mentionChipRef.current?.offsetWidth ?? 0
			setMentionIndent(chipWidth > 0 ? chipWidth + 8 : 0)
		}

		updateMentionIndent()
		window.addEventListener("resize", updateMentionIndent)

		return () => {
			window.removeEventListener("resize", updateMentionIndent)
		}
	}, [replyTarget])

	async function handleSubmit() {
		if (!draftBody.trim()) return
		const currentReplyTarget = replyTarget
		const isReply = currentReplyTarget !== null
		const { data } = await createComment({
			variables: {
				input: {
					body: draftBody,
					proposalSlug: slug,
					location: pendingLocation ?? undefined,
					parentId: currentReplyTarget?.commentId,
				},
			},
			refetchQueries: isReply ? [] : [ProposalCommentsDocument],
			update: (cache, { data }) => {
				const result = data?.createProposalComment
				if (result?.__typename !== "ProposalComment") return

				cache.updateQuery(
					{
						query: GetProposalDocument,
						variables: { slug },
					},
					(existing) => {
						if (
							!existing ||
							existing.proposalBySlug.__typename !== "Proposal"
						) {
							return existing
						}

						return {
							...existing,
							proposalBySlug: {
								...existing.proposalBySlug,
								commentCount: existing.proposalBySlug.commentCount + 1,
							},
						}
					},
				)

				if (!result.parent) return

				const replyResult = {
					...result,
					replyToUser: currentReplyTarget?.replyToUser ?? null,
				}
				cache.updateQuery(
					{
						query: ProposalCommentRepliesDocument,
						variables: { parentId: result.parent.id },
					},
					(existing) => {
						if (!existing) return existing
						return {
							...existing,
							proposalCommentReplies: [
								...existing.proposalCommentReplies,
								replyResult,
							],
						}
					},
				)
				cache.modify({
					id: cache.identify({
						__typename: "ProposalComment",
						id: result.parent.id,
					}),
					fields: {
						replyCount: (count: number) => count + 1,
					},
				})
			},
		})
		const createdComment = data?.createProposalComment
		if (createdComment?.__typename === "ProposalComment") {
			capture("comment_created", {
				proposal_slug: slug,
				type: createdComment.parent ? "reply" : "comment",
				has_location: Boolean(createdComment.location),
			})
			setPendingScrollTarget({
				commentId: createdComment.id,
				parentId: createdComment.parent?.id,
			})
		}
		clearCommentComposer()
	}

	function handleSubmitClick() {
		startTransition(async () => {
			await handleSubmit()
		})
	}

	return (
		<Box
			className={slots.root}
			data-focused={focused || undefined}
			data-auth-gate={!isSignedIn || undefined}
			onClick={handleClick}
		>
			<Box className={slots.inputWrap}>
				{replyTarget?.replyToUser && (
					<Box ref={mentionChipRef} className={slots.mentionChip}>
						<span>{`@${replyTarget.replyToUser.name}`}</span>
					</Box>
				)}
				<textarea
					className={slots.textarea}
					style={{
						textIndent: replyTarget?.replyToUser
							? `${mentionIndent}px`
							: undefined,
					}}
					placeholder={
						isSignedIn
							? "Share your thoughts on this proposal..."
							: "Sign in to comment..."
					}
					readOnly={!isSignedIn}
					value={draftBody}
					ref={textAreaRef}
					onChange={(e) => setDraftBody(e.target.value)}
					onKeyDown={handleTextareaKeyDown}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
				/>
			</Box>
			<Box className={slots.footer}>
				<AddLocationButton requireAuth={requireAuth} />
				<Button
					type="button"
					onClick={handleSubmitClick}
					size="xs"
					loading={isPending}
					disabled={!draftBody.trim()}
				>
					Post
				</Button>
			</Box>
		</Box>
	)
}
