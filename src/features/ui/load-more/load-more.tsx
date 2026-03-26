import { Button } from "#/features/ui/button"
import { VStack } from "#/features/ui/layout"
import { Typography } from "#/features/ui/typography"
import { css } from "#/styles/styled-system/css"

type LoadMoreProps = {
	total: number
	showing: number
	hasMore: boolean
	loading: boolean
	onLoadMore: () => void
	emptyLabel?: string
	hideEmpty?: boolean
}

export function LoadMore({
	total,
	showing,
	hasMore,
	loading,
	onLoadMore,
	emptyLabel = "No results",
	hideEmpty = false,
}: LoadMoreProps) {
	if (hideEmpty && total === 0) return null

	const label = hasMore
		? `Showing ${showing} of ${total}`
		: total === 0
			? emptyLabel
			: "You're all caught up"

	return (
		<VStack
			id="load-more"
			align="center"
			gap="4"
			className={css({ paddingTop: "8" })}
		>
			<Typography.Text color="stone.400" size="sm">
				{label}
			</Typography.Text>
			{hasMore && (
				<Button
					appearance="outline"
					intent="neutral"
					loading={loading}
					disabled={loading}
					onClick={onLoadMore}
				>
					Load more
				</Button>
			)}
		</VStack>
	)
}
