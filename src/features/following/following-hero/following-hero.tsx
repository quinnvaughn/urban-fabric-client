import { Box, Eyebrow, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

export function FollowingHero() {
	return (
		<Box
			className={css({
				borderBottom: "1px solid",
				borderBottomColor: "stone.200",
				background: "white",
				flexShrink: 0,
				px: "7",
				paddingTop: "8",
				paddingBottom: "6",
			})}
		>
			<VStack gap="2.5">
				<Eyebrow size="xs">Your Feed</Eyebrow>
				<Typography.Heading
					as="h1"
					size="xl"
					weight="light"
					font="serif"
					color="stone.900"
					fontStyle="italic"
					lineHeight="tight"
					className={css({ maxWidth: "500px", textWrap: "stable" })}
				>
					Proposals from people{" "}
					<Typography.Inline fontStyle="normal" color="coral.500">
						you follow.
					</Typography.Inline>
				</Typography.Heading>
				<Typography.Text
					size="md"
					color="stone.500"
					lineHeight="relaxed"
					className={css({ maxWidth: "460px" })}
				>
					New proposals from the urbanists, planners, and neighbors you're
					following.
				</Typography.Text>
			</VStack>
		</Box>
	)
}
