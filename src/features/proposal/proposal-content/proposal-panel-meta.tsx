import { Eye } from "lucide-react"
import { Box, HStack, Typography } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Props = {
	dateLabel: string
	locationLabel: string
	viewCount?: number
}

export function ProposalPanelMeta({
	dateLabel,
	locationLabel,
	viewCount,
}: Props) {
	return (
		<HStack gap="2" wrap>
			<Typography.Text size="sm" color="stone.500">
				{dateLabel}
			</Typography.Text>
			<PanelMetaDivider />
			<Typography.Text size="sm" color="stone.500">
				{locationLabel}
			</Typography.Text>
			{typeof viewCount === "number" && (
				<>
					<PanelMetaDivider />
					<Box
						className={css({
							display: "flex",
							alignItems: "center",
							gap: "1",
							color: "stone.500",
							fontSize: "sm",
						})}
					>
						<Eye
							size={12}
							className={css({
								display: "inline-block",
								marginLeft: "2px",
							})}
						/>
						{new Intl.NumberFormat("en-US", {
							notation: "compact",
						}).format(viewCount)}
					</Box>
				</>
			)}
		</HStack>
	)
}

function PanelMetaDivider() {
	return (
		<Box
			className={css({
				width: "3px",
				height: "3px",
				background: "stone.300",
				borderRadius: "full",
			})}
		/>
	)
}
