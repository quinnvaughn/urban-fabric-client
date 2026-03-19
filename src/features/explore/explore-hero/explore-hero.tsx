import { Box, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

export function ExploreHero() {
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
				<Typography.Text
					size="xs"
					weight="semibold"
					color="coral.500"
					transform="uppercase"
					letterSpacing="wider"
				>
					Community
				</Typography.Text>
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
					Street design,{" "}
					<Typography.Inline fontStyle="normal" color="coral.500">
						proposed
					</Typography.Inline>{" "}
					by people who actually use them.
				</Typography.Heading>
				<Typography.Text
					size="md"
					color="stone.500"
					lineHeight="relaxed"
					className={css({ maxWidth: "460px" })}
				>
					Browse proposals from urbanists, planners, and neighbors rethinking
					how streets work. Like what you see. Share it with your city council.
				</Typography.Text>
			</VStack>
		</Box>
	)
}
