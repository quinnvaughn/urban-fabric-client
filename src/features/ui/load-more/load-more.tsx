import { Button } from "#/features/ui/button"
import { VStack } from "#/features/ui/layout"
import { Typography } from "#/features/ui/typography"
import { css, cx } from "#/styles/styled-system/css"

type LoadMoreProps = {
	total: number
	showing: number
	hasMore: boolean
	loading: boolean
	onLoadMore: () => void
	emptyLabel?: string
	hideEmpty?: boolean
	completeLabel?: string
	className?: string
}

export function LoadMore({
	total,
	showing,
	hasMore,
	loading,
	onLoadMore,
	emptyLabel = "No results",
	hideEmpty = false,
	completeLabel = "You're all caught up",
	className,
}: LoadMoreProps) {
	if (hideEmpty && total === 0) return null

	const label = hasMore
		? `Showing ${showing} of ${total}`
		: total === 0
			? emptyLabel
			: completeLabel

	return (
		<VStack
			id="load-more"
			align="center"
			gap="4"
			className={cx(css({ paddingTop: "8" }), className)}
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
