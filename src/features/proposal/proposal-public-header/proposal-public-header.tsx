import { MapPin } from "lucide-react"
import { PublicNavActions } from "#/features/navigation"
import { Box, HStack, Typography } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { ProposalBrandMenu } from "../proposal-brand-menu"

interface ProposalPublicHeaderProps {
	proposalId: string
	title: string
	city: string
	region: string
	onDownloadImage: () => Promise<void>
	downloadDisabled?: boolean
}

export function ProposalPublicHeader({
	proposalId,
	title,
	city,
	region,
	onDownloadImage,
	downloadDisabled,
}: ProposalPublicHeaderProps) {
	return (
		<Box
			id="top-bar"
			as="header"
			className={css({
				flexShrink: 0,
				height: "var(--uf-header-height)",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				px: "4",
				gap: "2.5",
				borderBottom: "1px solid",
				borderBottomColor: "border.subtle",
				background: "white",
				zIndex: "floating",
				animation: "fadeDown 0.36s (--easings-spring) both",
				transition:
					"height 250ms (--easings-spring), opacity 200ms (---easings-in-out), border-bottom-color 200ms",
				overflow: "hidden",
			})}
		>
			<HStack
				gap="2.5"
				className={css({ flex: 1, minWidth: 0 })}
				align="center"
			>
				<ProposalBrandMenu
					proposalId={proposalId}
					source="proposal_desktop_header_menu"
					onDownloadImage={onDownloadImage}
					downloadDisabled={downloadDisabled}
				/>
				<Box
					className={css({
						width: "px",
						height: "18px",
						background: "stone.200",
						flexShrink: 0,
					})}
				/>
				<Typography.Text truncate color="stone.700" weight="medium" size="md">
					{title}
				</Typography.Text>
				<HStack
					gap="1"
					align="center"
					className={css({ flexShrink: 0, color: "stone.500" })}
				>
					<MapPin size={10} />
					<Typography.Text
						color="stone.500"
						size="sm"
					>{`${city}, ${region}`}</Typography.Text>
				</HStack>
			</HStack>
			<PublicNavActions authenticatedAction="new-fabric" />
		</Box>
	)
}
