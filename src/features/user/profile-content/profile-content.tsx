import { Box } from "#/features/ui"
import type { UserProfileFragment } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { ProfileBanner } from "../profile-banner"
import { ProfileBody } from "../profile-body"
import { ProfileInfo } from "../profile-info"

type Props = {
	user: UserProfileFragment
}

export function ProfileContent({ user }: Props) {
	return (
		<Box
			className={css({
				minHeight: "calc(100vh - var(--uf-header-height))",
				flex: 1,
				overflowY: "auto",
				display: "flex",
				flexDirection: "column",
			})}
		>
			<ProfileBanner bannerImageUrl={user.bannerImageUrl} />
			<ProfileInfo user={user} />
			<ProfileBody user={user} />
		</Box>
	)
}
