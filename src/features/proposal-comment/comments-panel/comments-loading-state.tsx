import { Box, HStack, Skeleton, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type CommentsLoadingStateProps = {
	count?: number
	isReplies?: boolean
}

export function CommentsLoadingState({
	count = 3,
	isReplies = false,
}: CommentsLoadingStateProps) {
	const skeletonIds = Array.from({ length: count }, (_, idx) => `skeleton-${idx + 1}`)

	const content = skeletonIds.map((id) => (
		<CommentCardSkeleton
			key={`${isReplies ? "reply" : "comment"}-${id}`}
			isReplies={isReplies}
		/>
	))

	return (
		<Box
			className={css({
				flex: 1,
				overflowY: "auto",
			})}
		>
			{isReplies ? <RepliesLoadingState>{content}</RepliesLoadingState> : content}
		</Box>
	)
}

function RepliesLoadingState({ children }: React.PropsWithChildren) {
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
			{children}
		</Box>
	)
}

function CommentCardSkeleton({ isReplies }: { isReplies: boolean }) {
	return (
		<Box
			className={css({
				px: isReplies ? "0" : "5",
				py: isReplies ? "2.5" : "3.5",
				borderBottom: "1px solid",
				borderBottomColor: {
					base: "border.subtle",
					_last: "transparent",
				},
			})}
		>
				<VStack gap="2">
					<HStack gap="2" align="start">
						<Skeleton.Circle
							size={isReplies ? 24 : 32}
							className={css({ marginTop: "0.5" })}
						/>
						<VStack gap="3" fullWidth>
							<HStack gap="4" align="center">
								<Skeleton.Line width={isReplies ? 146 : 178} height={11} />
								<Skeleton.Line width={90} height={11} />
							</HStack>
							<VStack
								gap="3"
								className={css({
									paddingRight: isReplies ? "0" : "4",
								})}
							>
								<Skeleton.Line width="100%" height={22} borderRadius="9999px" />
								<Skeleton.Line width="82%" height={22} borderRadius="9999px" />
								<Skeleton.Line width="60%" height={22} borderRadius="9999px" />
						</VStack>
					</VStack>
				</HStack>
			</VStack>
		</Box>
	)
}
