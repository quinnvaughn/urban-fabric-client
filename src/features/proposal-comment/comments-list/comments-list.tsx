import { useSuspenseQuery } from "@apollo/client/react"
import { VStack } from "#/features/ui"
import {
	type CommentSortBy,
	ProposalCommentsDocument,
} from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { ProposalComment } from "../proposal-comment"

type Props = {
	slug: string
	sort: CommentSortBy
}

export function CommentsList({ slug, sort }: Props) {
	const { data } = useSuspenseQuery(ProposalCommentsDocument, {
		variables: {
			proposalSlug: slug,
			sortBy: sort,
			limit: 100,
		},
	})

	return (
		<VStack gap="0" className={css({ overflowY: "auto", flex: 1 })}>
			{data.proposalComments.comments.map((comment) => (
				<ProposalComment key={comment.id} comment={comment} />
			))}
		</VStack>
	)
}
