import { useMutation } from "@apollo/client/react"
import { useState } from "react"
import { Button } from "#/features/ui"
import { ToggleFollowDocument } from "#/graphql/generated"
import { useCurrentUser, useRequireAuth } from "#/lib/graphql"

type Props = {
	userId: string
	isFollowedByMe: boolean
	size?: "xs" | "sm" | "md" | "lg"
}

export function FollowButton({ userId, isFollowedByMe, size = "xs" }: Props) {
	const { user: me } = useCurrentUser()
	const isOwner = me?.id === userId
	const [isFollowing, setIsFollowing] = useState(isFollowedByMe)
	const [justFollowed, setJustFollowed] = useState(false)
	const [isHovering, setIsHovering] = useState(false)
	const [toggleFollow] = useMutation(ToggleFollowDocument)
	const requireAuth = useRequireAuth(
		"Create an account or sign in to follow this creator",
		"follow creator",
	)

	if (isOwner) return null

	function handleFollow() {
		requireAuth(() => {
			const next = !isFollowing
			setIsFollowing(next)
			if (next) setJustFollowed(true)
			toggleFollow({
				variables: { userId },
				onError: () => setIsFollowing(!next),
			})
		})
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
		<Button
			size={size}
			appearance={appearance}
			intent={intent}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={handleMouseLeave}
			onClick={handleFollow}
		>
			{label}
		</Button>
	)
}
