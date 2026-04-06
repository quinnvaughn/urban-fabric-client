import { ChevronLeft } from "lucide-react"
import { Box, Button, HStack, Tooltip, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Props = {
	title: string
	onClose?: () => void
	closeLabel?: string
	paddingTop?: string
	clamp?: boolean
}

export function ProposalPanelHeader({
	title,
	onClose,
	closeLabel = "Close panel",
	paddingTop = "4",
	clamp,
}: Props) {
	return (
		<Box
			className={css({
				px: "5",
				paddingTop,
				flexShrink: 0,
			})}
		>
			<VStack gap="3">
				<HStack id="panel-header-top" gap="2.5" align="start">
					<VStack
						gap="1"
						id="panel-header-text"
						className={css({ flex: 1, minWidth: 0 })}
					>
						<Typography.Text
							size="xxs"
							color="coral.500"
							weight="semibold"
							transform="uppercase"
							letterSpacing="wider"
						>
							Proposal
						</Typography.Text>
						<Typography.Heading
							as="h1"
							font="serif"
							size="md"
							weight="light"
							lineHeight="tight"
							letterSpacing="snug"
							fontStyle="italic"
							clamp={clamp ? "2" : undefined}
						>
							{title}
						</Typography.Heading>
					</VStack>
					{onClose && (
						<Tooltip>
							<Tooltip.Trigger>
								<Button
									appearance="ghost"
									intent="neutral"
									size="xs"
									onClick={onClose}
								>
									<ChevronLeft size={14} />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>{closeLabel}</Tooltip.Content>
						</Tooltip>
					)}
				</HStack>
			</VStack>
		</Box>
	)
}
