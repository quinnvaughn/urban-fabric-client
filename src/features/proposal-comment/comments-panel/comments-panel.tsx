import { Suspense, useState } from "react"
import { HStack, Menu, VStack } from "#/features/ui"
import { CommentSortBy } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { CommentsList } from "../comments-list"
import { ComposeArea } from "../compose-area"

type Props = {
	slug: string
}

export function CommentsPanel({ slug }: Props) {
	const [sort, setSort] = useState<CommentSortBy>(CommentSortBy.MostRecent)

	return (
		<VStack
			gap="0"
			className={css({
				overflowY: "auto",
				flex: 1,
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
			<Suspense
				fallback={<div className={css({ flex: 1 })}>Loading comments...</div>}
			>
				<CommentsList slug={slug} sort={sort} />
			</Suspense>
			<ComposeArea slug={slug} />
		</VStack>
	)
}
