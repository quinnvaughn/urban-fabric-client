import { useFragment, useMutation } from "@apollo/client/react"
import { Link } from "@tanstack/react-router"
import { Eye, Heart, MapPin, MessageSquare } from "lucide-react"
import { DateTime } from "luxon"
import {
	Avatar,
	Badge,
	Box,
	Button,
	Card,
	HStack,
	Typography,
} from "#/features/ui"
import {
	type ProposalCardFragment,
	ProposalCardFragmentDoc,
	ToggleProposalLikeDocument,
} from "#/graphql/generated"
import { adjustMyDashboardEngagementCache } from "#/lib/apollo"
import { useRequireAuth } from "#/lib/graphql"
import { useCurrentUser } from "#/lib/graphql/hooks/use-current-user"
import { enumValueToReadableLabel } from "#/lib/string"
import { css } from "#/styles/styled-system/css"

type Props = { proposal: ProposalCardFragment }

export function ProposalCard({ proposal: proposalRef }: Props) {
	const { data, complete } = useFragment({
		fragment: ProposalCardFragmentDoc,
		fragmentName: "ProposalCard",
		from: { __typename: "Proposal", id: proposalRef.id },
	})
	const proposal: ProposalCardFragment = complete
		? (data as ProposalCardFragment)
		: proposalRef
	const [toggleLike] = useMutation(ToggleProposalLikeDocument)
	const { user } = useCurrentUser()
	const requireAuth = useRequireAuth(
		"Create an account or sign in to like this proposal",
		"like proposal",
	)
	const isOwner = user?.id === proposal.creator.id

	function handleLike() {
		requireAuth(() => {
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
		<Card
			size="sm"
			lift="md"
			shadow="sm"
			className={css({
				position: "relative",
				animation: "fadeUp 200ms var(--easings-out)",
			})}
		>
			<Link
				to="/proposal/$slug"
				params={{ slug: proposal.slug }}
				search={{ tab: undefined, comment: undefined, parent: undefined }}
				className={css({
					position: "absolute",
					inset: "0",
					zIndex: "base",
				})}
			/>
			<Card.Media>
				<img src={proposal.snapshotThumbnail} alt="Proposal Snapshot" />
			</Card.Media>
			<Card.Body>
				<Box
					className={css({
						display: "flex",
						flexDirection: "column",
						gap: "1.5",
						flex: 1,
					})}
				>
					<Box className={css({ h: "10" })}>
						<Typography.Text
							size="sm"
							weight="semibold"
							clamp={"2"}
							lineHeight={"snug"}
						>
							{proposal.title}
						</Typography.Text>
					</Box>
					<Box className={css({ h: "14", overflow: "hidden" })}>
						<HStack gap="1" wrap>
							{proposal.categories.slice(0, 3).map((category) => (
								<Badge key={category} tone="accent" size="xxs">
									{enumValueToReadableLabel(category)}
								</Badge>
							))}
							{proposal.categories.length > 3 && (
								<Badge tone="neutral" size="xxs">
									+{proposal.categories.length - 3}
								</Badge>
							)}
						</HStack>
					</Box>
					<HStack gap="1" align="center">
						<Avatar size="xxs" name={proposal.creator.name} />
						<Link
							className={css({
								fontSize: "xs",
								color: { base: "stone.500", _hover: "brand.default" },
								position: "relative",
							})}
							to={user ? "/dashboard/user/$username" : "/user/$username"}
							params={{ username: proposal.creator.username }}
						>
							{proposal.creator.name}
						</Link>
					</HStack>
					<HStack
						gap="1"
						align="center"
						className={css({ color: "stone.400" })}
					>
						<MapPin size={10} />
						<Typography.Text size="xs" color="stone.400">
							{`${proposal.snapshotLocationCity}, ${proposal.snapshotLocationRegionAbbr ?? proposal.snapshotLocationRegion} · ${DateTime.fromISO(proposal.publishedAt as string).toRelative()}`}
						</Typography.Text>
					</HStack>
				</Box>
			</Card.Body>
			<Card.Footer>
				<HStack gap="4" justify="space-between" className={css({ w: "full" })}>
					<HStack
						gap="4"
						align="center"
						className={css({ color: "stone.400" })}
					>
						<HStack gap="1" align="center">
							<Eye size={12} />
							<Typography.Text size="sm" color="stone.400">
								{new Intl.NumberFormat("en-US", {
									notation: "compact",
								}).format(proposal.viewCount)}
							</Typography.Text>
						</HStack>
						<HStack gap="1" align="center">
							<MessageSquare size={12} />
							<Typography.Text size="sm" color="stone.400">
								{new Intl.NumberFormat("en-US", {
									notation: "compact",
								}).format(proposal.commentCount)}
							</Typography.Text>
						</HStack>
					</HStack>
					<Button
						type="button"
						appearance={proposal.isLikedByMe ? "solid" : "subtle"}
						intent="brand"
						className={css({
							py: "1",
							px: "2",
							fontSize: "xs",
							fontWeight: "medium",
							borderRadius: "full",
							minH: "0",
							position: "relative",
							zIndex: "raised",
						})}
						onClick={handleLike}
						startIcon={<Heart size={12} />}
					>
						{proposal.likeCount}
					</Button>
				</HStack>
			</Card.Footer>
		</Card>
	)
}
