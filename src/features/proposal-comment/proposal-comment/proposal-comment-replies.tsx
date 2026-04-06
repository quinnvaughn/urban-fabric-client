import { useSuspenseQuery } from "@apollo/client/react"
import { Box } from "#/features/ui"
import { ProposalCommentRepliesDocument } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { CommentReply } from "./comment-reply"

type Props = {
	commentId: string
	readOnly?: boolean
}

export function ProposalCommentReplies({ commentId, readOnly = false }: Props) {
	const { data } = useSuspenseQuery(ProposalCommentRepliesDocument, {
		variables: {
			parentId: commentId,
		},
	})
	return (
		<Box
			className={css({
				borderLeft: "2px solid",
				borderLeftColor: "stone.200",
				marginLeft: "8",
				marginTop: "2.5",
				paddingLeft: "3.5",
			})}
		>
			{data.proposalCommentReplies.map((reply) => (
				<CommentReply key={reply.id} reply={reply} readOnly={readOnly} />
			))}
		</Box>
	)
}
