import { useMutation } from "@apollo/client/react"
import { Eye, Heart } from "lucide-react"
import { useTransition } from "react"
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
	ToggleProposalLikeDocument,
} from "#/graphql/generated"
import { enumValueToReadableLabel } from "#/lib/string"
import { css } from "#/styles/styled-system/css"

type Props = { proposal: ProposalCardFragment }

export function ProposalCard({ proposal }: Props) {
	const [toggleLike] = useMutation(ToggleProposalLikeDocument)
	const [isPending, startTransition] = useTransition()
	return (
		<Card
			size="sm"
			className={css({
				animation: "fadeUp 200ms var(--easings-out)",
			})}
		>
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
					<Typography.Text
						size="sm"
						weight="semibold"
						clamp={"2"}
						lineHeight={"snug"}
					>
						{proposal.title}
					</Typography.Text>
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
					<HStack gap="1" align="center">
						<Avatar size="xs" name={proposal.creator.name} />
						<Typography.Text size="xs" color="stone.500">
							{proposal.creator.name}
						</Typography.Text>
					</HStack>
				</Box>
			</Card.Body>
			<Card.Footer>
				<HStack gap="4" justify="space-between" className={css({ w: "full" })}>
					<HStack
						gap="1"
						align="center"
						className={css({ color: "stone.400" })}
					>
						<Eye size={12} />
						<Typography.Text size="sm" color="stone.400">
							{new Intl.NumberFormat("en-US", { notation: "compact" }).format(
								proposal.viewCount,
							)}
						</Typography.Text>
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
						})}
						loading={isPending}
						onClick={() => {
							startTransition(() => {
								toggleLike({
									variables: { input: { proposalId: proposal.id } },
								})
							})
						}}
						startIcon={<Heart size={12} />}
					>
						{proposal.likeCount}
					</Button>
				</HStack>
			</Card.Footer>
		</Card>
	)
}
