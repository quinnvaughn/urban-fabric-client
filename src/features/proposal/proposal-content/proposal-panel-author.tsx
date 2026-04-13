import { Link } from "@tanstack/react-router"
import { Avatar, HStack } from "#/features/ui"
import { FollowButton } from "#/features/user/follow-button"
import { css } from "#/styles/styled-system/css"

type Props = {
	name: string
	username: string
	profilePictureUrl?: string | null
	creatorId: string
	isFollowedByMe: boolean
}

export function ProposalPanelAuthor({
	name,
	username,
	profilePictureUrl,
	creatorId,
	isFollowedByMe,
}: Props) {
	return (
		<HStack align="center" gap="2" wrap>
			<Avatar size="md" name={name} profilePictureUrl={profilePictureUrl} />
			<Link
				to="/user/$username"
				params={{ username }}
				className={css({
					fontSize: "sm",
					color: "stone.700",
					fontWeight: "medium",
					_hover: {
						color: "brand.default",
						textDecoration: "underline",
					},
				})}
			>
				{name}
			</Link>
			<FollowButton userId={creatorId} isFollowedByMe={isFollowedByMe} />
		</HStack>
	)
}
