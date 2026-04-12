import { CornerUpLeft, X } from "lucide-react"
import { Avatar, Box, Button, HStack, Typography, VStack } from "#/features/ui"
import { useCurrentUser } from "#/lib/graphql"
import { sva } from "#/styles/styled-system/css"
import { useCommentComposerStore } from "../comment-composer-store"
import { CommentComposer } from "./composer"

const composer = sva({
	slots: ["replyContext", "container", "replyText"],
	base: {
		container: {
			flexShrink: 0,
			paddingTop: "3",
			px: "4",
			paddingBottom: "3.5",
			borderTop: "1px solid",
			borderTopColor: "border.subtle",
			background: "stone.50",
		},
		replyContext: {
			display: "flex",
			alignItems: "center",
			gap: "1.5",
			px: "2.5",
			py: "1.5",
			bg: "stone.100",
			border: "1px solid",
			borderColor: "stone.200",
			borderRadius: "md",
			fontSize: "xs",
			color: "stone.600",
		},
		replyText: {
			fontWeight: "semibold",
			flex: 1,
		},
	},
})

type Props = {
	slug: string
}

export function ComposeArea({ slug }: Props) {
	const { user } = useCurrentUser()
	const { replyTarget, setReplyTarget } = useCommentComposerStore()
	const slots = composer()

	function onCancelReply() {
		setReplyTarget(null)
	}

	return (
		<Box className={slots.container} aria-label="Compose area" role="region">
			<VStack gap="2">
				{replyTarget && (
					<div className={slots.replyContext}>
						<CornerUpLeft
							size={11}
							strokeWidth={"2.5px"}
							strokeLinecap="round"
						/>
						<span className={slots.replyText}>
							Replying to {replyTarget.displayName}
						</span>
						<Button
							size="xs"
							onClick={onCancelReply}
							appearance="ghost"
							intent="neutral"
							aria-label="Cancel reply"
						>
							<X size={12} />
						</Button>
					</div>
				)}
				<HStack gap="2" align="center">
					<Avatar
						name={user?.name || ""}
						tone={user?.id ? "accent" : "neutral"}
						size="xs"
						profilePictureUrl={user?.profilePictureUrl}
					/>
					<Typography.Text size="sm" weight="medium" color="stone.600">
						Add a comment
					</Typography.Text>
				</HStack>
				<CommentComposer slug={slug} />
			</VStack>
		</Box>
	)
}
