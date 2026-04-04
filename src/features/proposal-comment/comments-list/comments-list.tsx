import { useSuspenseQuery } from "@apollo/client/react"
import { match } from "ts-pattern"
import { VStack } from "#/features/ui"
import {
	type CommentSortBy,
	ProposalCommentsDocument,
} from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { ProposalComment } from "../proposal-comment"
import { CommentsEmptyState } from "./comments-empty-state"

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

	return match(data.proposalComments.comments)
		.when(
			(comments) => comments.length === 0,
			() => <CommentsEmptyState />,
		)
		.otherwise((comments) => (
			<VStack gap="0" className={css({ overflowY: "auto", flex: 1 })}>
				{comments.map((comment) => (
					<ProposalComment key={comment.id} comment={comment} slug={slug} />
				))}
			</VStack>
		))
}
