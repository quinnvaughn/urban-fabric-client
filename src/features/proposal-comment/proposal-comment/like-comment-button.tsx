import { useMutation } from "@apollo/client/react"
import { Heart } from "lucide-react"
import { Button } from "#/features/ui"
import {
	type CommentCardFragment,
	ToggleProposalCommentLikeDocument,
} from "#/graphql/generated"
import { useRequireAuth } from "#/lib/graphql"

type Props = {
	comment: CommentCardFragment
}

export function LikeCommentButton({ comment }: Props) {
	const requireAuth = useRequireAuth(
		"Create an account or sign in to like this comment",
		"like comment",
	)
	const [toggleLike] = useMutation(ToggleProposalCommentLikeDocument)

	function handleToggleLike() {
		requireAuth(() => {
			toggleLike({
				variables: { input: { commentId: comment.id } },
				optimisticResponse: {
					__typename: "Mutation",
					toggleProposalCommentLike: {
						__typename: "ProposalComment",
						id: comment.id,
						isLikedByMe: !comment.isLikedByMe,
						likeCount: comment.isLikedByMe
							? comment.likeCount - 1
							: comment.likeCount + 1,
					},
				},
			})
		})
	}

	return (
		<Button
			size="xs"
			appearance={"ghost"}
			startIcon={
				<Heart
					size={12}
					fill={comment.isLikedByMe ? "var(--colors.teal.600)" : "none"}
				/>
			}
			onClick={handleToggleLike}
		>
			{comment.likeCount}
		</Button>
	)
}
