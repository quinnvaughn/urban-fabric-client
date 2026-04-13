import { useMutation } from "@apollo/client/react"
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { Avatar, Button, HStack } from "#/features/ui"
import { ToggleFollowDocument } from "#/graphql/generated"
import { useCurrentUser, useRequireAuth } from "#/lib/graphql"
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
	const { user } = useCurrentUser()
	const isOwner = user?.id === creatorId
	const [isFollowing, setIsFollowing] = useState(isFollowedByMe)
	const [justFollowed, setJustFollowed] = useState(false)
	const [isHovering, setIsHovering] = useState(false)
	const [toggleFollow] = useMutation(ToggleFollowDocument)
	const requireAuth = useRequireAuth(
		"Create an account or sign in to follow this creator",
		"follow creator",
	)

	function handleFollow() {
		requireAuth(() => {
			const next = !isFollowing
			setIsFollowing(next)
			if (next) setJustFollowed(true)
			toggleFollow({
				variables: { userId: creatorId },
				onError: () => setIsFollowing(!next),
			})
		})
	}

	function handleMouseEnter() {
		setIsHovering(true)
	}

	function handleMouseLeave() {
		setIsHovering(false)
		if (justFollowed) setJustFollowed(false)
	}

	let appearance: "solid" | "outline" = "solid"
	let intent: "brand" | "danger" = "brand"
	let label = "Follow"

	if (isFollowing) {
		if (justFollowed || !isHovering) {
			appearance = justFollowed ? "solid" : "outline"
			intent = "brand"
			label = "Following"
		} else {
			appearance = "solid"
			intent = "danger"
			label = "Unfollow"
		}
	}

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
			{!isOwner && (
				<Button
					size="xs"
					appearance={appearance}
					intent={intent}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onClick={handleFollow}
				>
					{label}
				</Button>
			)}
		</HStack>
	)
}
