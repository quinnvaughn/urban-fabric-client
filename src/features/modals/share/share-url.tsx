import { Check, Copy, Link } from "lucide-react"
import { Box, Button, HStack, Typography } from "#/features/ui"
import type { EventMap } from "#/lib/analytics"
import { useAnalytics } from "#/lib/analytics"
import { useTransientText } from "#/lib/hooks"
import { css, cx } from "#/styles/styled-system/css"
import { buildShareUrl } from "./share-link"

type SharedEvent = {
	[K in keyof EventMap]: EventMap[K] extends { method: string; source: string }
		? K
		: never
}[keyof EventMap]

const readonlyField = css({
	flex: 1,
	display: "flex",
	alignItems: "center",
	gap: "2",
	height: "36px",
	background: "stone.100",
	border: "1px solid",
	borderColor: "stone.200",
	borderRadius: "md",
	minWidth: 0,
	color: "stone.400",
})

type Props = {
	link: string
	source: string
	utmCampaign?: string
	analyticsEvent?: SharedEvent
}

export function ShareURL({
	link,
	source,
	utmCampaign,
	analyticsEvent = "proposal_shared",
}: Props) {
	const [copyText, activateCopy] = useTransientText("Copy Link", "Copied!")
	const { capture } = useAnalytics()

	function handleCopy() {
		navigator.clipboard
			.writeText(buildShareUrl(link, "copy_link", source, utmCampaign))
			.then(activateCopy)
		capture(analyticsEvent as "proposal_shared", { method: "copy_link", source })
	}

	return (
		<HStack gap="2" align="center">
			<Box className={cx(readonlyField, css({ px: "2.5" }))}>
				<Link size={11} />
				<Typography.Text truncate size="xs" color="stone.600">
					{link}
				</Typography.Text>
			</Box>
			<Button
				size="sm"
				intent="brand"
				startIcon={
					copyText === "Copied!" ? <Check size={12} /> : <Copy size={12} />
				}
				onClick={handleCopy}
			>
				{copyText}
			</Button>
		</HStack>
	)
}
