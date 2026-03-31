import { useMutation } from "@apollo/client/react"
import { Heart } from "lucide-react"
import { Button, Typography } from "#/features/ui"
import {
	type GetProposalQuery,
	ToggleProposalLikeDocument,
} from "#/graphql/generated"
import { useAnalytics } from "#/lib/analytics"
import { adjustMyDashboardEngagementCache } from "#/lib/apollo"
import { useCurrentUser, useRequireAuth } from "#/lib/graphql"
import { css } from "#/styles/styled-system/css"

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

type Props = {
	isMobile?: boolean
	proposal: Proposal
}

export function LikeProposalButton({ isMobile, proposal }: Props) {
	const [toggleLike] = useMutation(ToggleProposalLikeDocument)
	const { data: meData } = useCurrentUser()
	const { capture } = useAnalytics()
	const requireAuth = useRequireAuth(
		"Create an account or sign in to like this proposal",
		"like",
	)
	const isOwner = meData?.me?.id === proposal.creator.id
	function handleLike() {
		requireAuth(() => {
			if (!proposal.isLikedByMe) capture("proposal_liked")
			const likeDelta = proposal.isLikedByMe ? -1 : 1
			toggleLike({
				variables: { input: { proposalId: proposal.id } },
				optimisticResponse: {
					__typename: "Mutation",
					toggleProposalLike: {
						__typename: "Proposal",
						id: proposal.id,
						isLikedByMe: !proposal.isLikedByMe,
						likeCount: proposal.isLikedByMe
							? proposal.likeCount - 1
							: proposal.likeCount + 1,
					},
				},
				update(cache, { data }) {
					if (data?.toggleProposalLike.__typename !== "Proposal") return
					if (!isOwner) return
					adjustMyDashboardEngagementCache(cache, { likesDelta: likeDelta })
				},
			})
		})
	}
	return (
		<Button
			size={"md"}
			intent="brand"
			appearance={proposal.isLikedByMe ? "solid" : "subtle"}
			startIcon={<Heart size={16} />}
			className={css({ flex: isMobile ? undefined : 1 })}
			endIcon={
				!isMobile && (
					<Typography.Text
						className={css({ color: "inherit", opacity: 0.7 })}
						weight="normal"
					>
						{new Intl.NumberFormat("en-US", {
							notation: "compact",
						}).format(proposal.likeCount)}
					</Typography.Text>
				)
			}
			onClick={handleLike}
		>
			<Typography.Text className={css({ color: "inherit" })} weight="medium">
				{isMobile
					? proposal.likeCount
					: proposal.isLikedByMe
						? "Liked"
						: "Like"}
			</Typography.Text>
		</Button>
	)
}
