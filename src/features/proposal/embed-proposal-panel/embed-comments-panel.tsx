import { Suspense, useState } from "react"
import { HStack, Menu, VStack } from "#/features/ui"
import { CommentSortBy } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { CommentsList } from "../../proposal-comment/comments-list"
import { CommentsLoadingState } from "../../proposal-comment/comments-panel/comments-loading-state"

export function EmbedCommentsPanel({
	slug,
	commentCount,
}: {
	slug: string
	commentCount: number
}) {
	const [sort, setSort] = useState<CommentSortBy>(CommentSortBy.MostRecent)

	return (
		<Suspense fallback={<CommentsLoadingState count={10} />}>
			<VStack
				gap="0"
				className={css({
					overflowY: "auto",
					flex: 1,
					minH: 0,
					paddingTop: "1",
				})}
			>
				<HStack justify="end" fullWidth className={css({ px: "4", py: "1" })}>
					<Menu placement="bottom-end">
						<Menu.FilterTrigger>
							{sort === CommentSortBy.MostRecent ? "Most recent" : "Most liked"}
						</Menu.FilterTrigger>
						<Menu.Content size="sm">
							<Menu.CheckItem
								checked={sort === CommentSortBy.MostRecent}
								onCheckedChange={() => setSort(CommentSortBy.MostRecent)}
							>
								Most recent
							</Menu.CheckItem>
							<Menu.CheckItem
								checked={sort === CommentSortBy.MostLiked}
								onCheckedChange={() => setSort(CommentSortBy.MostLiked)}
							>
								Most liked
							</Menu.CheckItem>
						</Menu.Content>
					</Menu>
				</HStack>
				<CommentsList
					slug={slug}
					sort={sort}
					readOnly
					completeLabel={`${new Intl.NumberFormat("en-US").format(commentCount)} comments · join the conversation on Urban Fabric`}
				/>
			</VStack>
		</Suspense>
	)
}
