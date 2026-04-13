import { Calendar, MapPin, Share2 } from "lucide-react"
import { DateTime } from "luxon"
import { Box, Button, HStack, Typography, VStack } from "#/features/ui"
import type { UserProfileFragment } from "#/graphql/generated"
import { useCurrentUser } from "#/lib/graphql"
import { getInitials } from "#/lib/string"
import { useModalStore } from "#/stores"
import { css } from "#/styles/styled-system/css"
import { FollowButton } from "../follow-button"
import { ProfileStat } from "../profile-stat"

type Props = {
	user: UserProfileFragment
}

const metaItem = css({
	display: "flex",
	gap: "1",
	alignItems: "center",
	fontSize: "sm",
	color: "stone.500",
})

export function ProfileInfo({ user }: Props) {
	const { user: me } = useCurrentUser()
	const { open } = useModalStore()

	const isUser = me?.id === user.id
	return (
		<Box
			className={css({
				px: "7",
				paddingBottom: "5",
				backgroundColor: "white",
				borderBottom: "1px solid",
				borderBottomColor: "border.subtle",
				maxWidth: "700px",
				margin: "0 auto",
				width: "100%",
			})}
		>
			<VStack gap="7">
				<VStack gap="2.5">
					<VStack gap="2">
						<Box className={css({ marginTop: "-65px" })}>
							{user.profilePictureUrl ? (
								<img
									src={user.profilePictureUrl}
									alt=""
									className={css({
										width: "130px",
										height: "130px",
										borderRadius: "full",
										objectFit: "cover",
										objectPosition: "center",
										border: "3px solid",
										borderColor: "white",
										boxShadow: "md",
										display: "block",
									})}
								/>
							) : (
								<Box
									className={css({
										width: "130px",
										height: "130px",
										borderRadius: "full",
										background: "accent.default",
										color: "white",
										fontSize: "3xl",
										fontWeight: "semibold",
										letterSpacing: "snug",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										border: "3px solid",
										borderColor: "white",
										boxShadow: "md",
									})}
								>
									{getInitials(user.name)}
								</Box>
							)}
						</Box>
						<HStack gap="4" justify="between" align="start">
							<Box className={css({ flex: 1, minWidth: 0 })}>
								<Typography.Heading
									font="serif"
									weight="light"
									lineHeight="tight"
								>
									{user.name}
								</Typography.Heading>
								<Typography.Text size="sm" color="stone.500">
									@{user.username}
								</Typography.Text>
							</Box>
							<HStack gap="2">
								<Button
									type="button"
									size="sm"
									intent="neutral"
									appearance="outline"
									startIcon={<Share2 size={14} />}
									onClick={() =>
										open("shareProfile", {
											name: user.name,
											link: window.location.href,
											source: "share_button",
										})
									}
								>
									Share
								</Button>
								{isUser ? (
									<Button
										onClick={() => open("editProfile", { user })}
										appearance="outline"
										size="sm"
										intent="neutral"
									>
										Edit profile
									</Button>
								) : (
									<FollowButton
										userId={user.id}
										isFollowedByMe={user.isFollowedByMe}
										size="sm"
									/>
								)}
							</HStack>
						</HStack>
						{user.bio && (
							<Typography.Text
								size="md"
								color="stone.700"
								lineHeight="relaxed"
								className={css({ maxWidth: "480px" })}
							>
								{user.bio}
							</Typography.Text>
						)}
					</VStack>
					<HStack gap="3.5" wrap align="center">
						{user.location && (
							<Box className={metaItem}>
								<MapPin size={12} />
								<span>{user.location}</span>
							</Box>
						)}
						<Box className={metaItem}>
							<Calendar size={12} />
							<span>
								Joined {DateTime.fromISO(user.createdAt).toFormat("LLLL y")}
							</span>
						</Box>
					</HStack>
				</VStack>
				<HStack
					gap="6"
					className={css({
						borderTop: "1px solid",
						borderTopColor: "stone.200",
						paddingTop: "4",
					})}
				>
					<ProfileStat label="proposals" value={user.numProposals} />
					<ProfileStat label="views" value={user.numViews} />
					<ProfileStat label="likes" value={user.numProposals} />
				</HStack>
			</VStack>
		</Box>
	)
}
