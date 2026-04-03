import { Avatar, Box, HStack, Typography, VStack } from "#/features/ui"
import { useCurrentUser } from "#/lib/graphql"
import { css } from "#/styles/styled-system/css"
import { CommentComposer } from "./composer"

type Props = {}

export function ComposeArea(_: Props) {
	const { user } = useCurrentUser()
	return (
		<Box
			className={css({
				flexShrink: 0,
				paddingTop: "3",
				px: "4",
				paddingBottom: "3.5",
				borderTop: "1px solid",
				borderTopColor: "border.subtle",
				background: "stone.50",
			})}
			aria-label="Compose area"
			role="region"
		>
			<VStack gap="2">
				<HStack gap="2" align="center">
					<Avatar
						name={user?.name || ""}
						tone={user?.id ? "accent" : "neutral"}
						size="xs"
					/>
					<Typography.Text size="sm" weight="medium" color="stone.600">
						Add a comment
					</Typography.Text>
				</HStack>
				<CommentComposer />
			</VStack>
		</Box>
	)
}
