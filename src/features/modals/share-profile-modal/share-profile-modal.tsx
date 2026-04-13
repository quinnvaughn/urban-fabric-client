import { useEffect } from "react"
import { Divider, Grid, Modal, VStack } from "#/features/ui"
import { useAnalytics } from "#/lib/analytics"
import {
	facebookDest,
	redditDest,
	ShareLink,
	ShareURL,
	twitterDest,
} from "../share"

const profileDests = [twitterDest, facebookDest, redditDest]

export function ShareProfileModal({
	open,
	onClose,
	name,
	link,
	source,
}: {
	open: boolean
	onClose: () => void
	name: string
	link: string
	source: string
}) {
	const { capture } = useAnalytics()

	useEffect(() => {
		if (open) capture("profile_share_modal_opened", { source })
	}, [open, source, capture])

	return (
		<Modal
			open={open}
			onClose={() => {
				capture("profile_share_modal_dismissed", { source })
				onClose()
			}}
			size="sm"
		>
			<Modal.Header>
				<VStack gap="1">
					<Modal.Eyebrow>Profile</Modal.Eyebrow>
					<Modal.Title
						font="serif"
						color="stone.900"
						fontStyle="italic"
						size="lg"
						weight="light"
					>
						{name}
					</Modal.Title>
				</VStack>
				<Modal.CloseBtn />
			</Modal.Header>
			<Modal.Body>
				<VStack gap="4">
					<Grid cols={3} gap="2">
						{profileDests.map((dest) => (
							<ShareLink
								key={dest.name}
								dest={dest}
								link={link}
								title={name}
								source={source}
								utmCampaign="share_profile"
								analyticsEvent="profile_shared"
							/>
						))}
					</Grid>
					<Divider />
					<ShareURL
						link={link}
						source={source}
						utmCampaign="share_profile"
						analyticsEvent="profile_shared"
					/>
				</VStack>
			</Modal.Body>
		</Modal>
	)
}
