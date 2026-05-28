import { MapPin } from "lucide-react"
import { Box, HStack, Logo, Typography } from "#/features/ui"
import type { GetProposalQuery } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

type Props = {
	proposal: Proposal
}

export function EmbedProposalHeader({ proposal }: Props) {
	const locationLabel = `${proposal.snapshotLocationCity}, ${proposal.snapshotLocationRegionAbbr ?? proposal.snapshotLocationRegion}`
	return (
		<Box
			as="header"
			className={css({
				height: "var(--uf-topbar-height)",
				background: "brand.default",
				gap: "2.5",
				display: "flex",
				alignItems: "center",
				px: "4",
			})}
		>
			<Logo onDark size="xl" />
			<Box
				className={css({
					height: "4.5",
					w: "px",
					background: "rgba(255, 255, 255, 0.25)",
					display: { base: "none", sm: "block" },
				})}
			/>
			<Typography.Text
				size="sm"
				className={css({ color: "rgba(255,255,255,0.75)" })}
				truncate
			>
				{proposal.title}
			</Typography.Text>
			<Box
				className={css({
					height: "4.5",
					w: "px",
					background: "rgba(255, 255, 255, 0.25)",
					display: { base: "none", md: "block" },
				})}
			/>
			<Typography.Text
				size="sm"
				className={css({
					color: "rgba(255,255,255,0.75)",
					display: { base: "none", md: "block" },
				})}
				truncate
			>
				by {proposal.creator.name}
			</Typography.Text>
			<Box
				className={css({
					height: "4.5",
					w: "px",
					background: "rgba(255, 255, 255, 0.25)",
					display: { base: "none", sm: "block" },
				})}
			/>
			<HStack
				gap="1"
				align="center"
				className={css({
					flexShrink: 0,
					color: "rgba(255,255,255,0.75)",
					display: { base: "none", sm: "flex" },
				})}
			>
				<MapPin size={10} />
				<Typography.Text size="xs" className={css({ color: "inherit" })}>
					{locationLabel}
				</Typography.Text>
			</HStack>
		</Box>
	)
}
