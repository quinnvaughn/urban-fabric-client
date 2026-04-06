import { ExternalLink, Eye, Heart } from "lucide-react"
import { ExternalLink as Anchor, Box, HStack, Typography } from "#/features/ui"
import type { GetProposalQuery } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

export function EmbedProposalFooter({ proposal }: { proposal: Proposal }) {
	return (
		<Box
			className={css({
				flexShrink: 0,
				borderTop: "1px solid",
				borderTopColor: "border.subtle",
				px: "5",
				py: "3.5",
				display: "flex",
				alignItems: "center",
				justify: "between",
				gap: "4",
			})}
		>
			<HStack gap="2">
				<EmbedStat
					icon={<Eye size={14} />}
					value={new Intl.NumberFormat("en-US", {
						notation: "compact",
					}).format(proposal.viewCount)}
				/>
				<EmbedStat
					icon={<Heart size={14} />}
					value={new Intl.NumberFormat("en-US", {
						notation: "compact",
					}).format(proposal.likeCount)}
				/>
			</HStack>
			<Anchor
				href={`/proposal/${proposal.slug}`}
				className={button({ size: "sm" })}
			>
				View proposal
				<ExternalLink size={16} />
			</Anchor>
		</Box>
	)
}

function EmbedStat({ icon, value }: { icon: React.ReactNode; value: string }) {
	return (
		<Box
			className={css({
				display: "flex",
				alignItems: "center",
				gap: "1.5",
				color: "stone.400",
			})}
		>
			<Box className={css({ display: "flex", alignItems: "center" })}>
				{icon}
			</Box>
			<Typography.Text size="md" className={css({ color: "inherit" })}>
				{value}
			</Typography.Text>
		</Box>
	)
}
