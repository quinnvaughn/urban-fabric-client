import { useSuspenseQuery } from "@apollo/client/react"
import { useTransition } from "react"
import { match } from "ts-pattern"
import { LoadMore, VStack } from "#/features/ui"
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
	readOnly?: boolean
	completeLabel?: string
}

const COMMENTS_PAGE_SIZE = 20

export function CommentsList({
	slug,
	sort,
	readOnly = false,
	completeLabel,
}: Props) {
	const [isPending, startTransition] = useTransition()
	const { data, fetchMore } = useSuspenseQuery(ProposalCommentsDocument, {
		variables: {
			proposalSlug: slug,
			sortBy: sort,
			offset: 0,
			limit: COMMENTS_PAGE_SIZE,
		},
	})

	const { comments, total, hasMore } = data.proposalComments

	function handleLoadMore() {
		if (isPending || !hasMore) return

		startTransition(() => {
			void fetchMore({
				variables: {
					proposalSlug: slug,
					sortBy: sort,
					offset: comments.length,
					limit: COMMENTS_PAGE_SIZE,
				},
			})
		})
	}

	return match(comments)
		.when(
			(items) => items.length === 0,
			() => <CommentsEmptyState />,
		)
		.otherwise((items) => (
			<VStack gap="0" className={css({ overflowY: "auto", flex: 1, minH: 0 })}>
				{items.map((comment) => (
					<ProposalComment
						key={comment.id}
						comment={comment}
						slug={slug}
						readOnly={readOnly}
					/>
				))}
				<LoadMore
					total={total}
					showing={items.length}
					hasMore={hasMore}
					loading={isPending}
					onLoadMore={handleLoadMore}
					completeLabel={completeLabel}
					className={css({ paddingTop: "4", paddingBottom: "6" })}
				/>
			</VStack>
		))
}
