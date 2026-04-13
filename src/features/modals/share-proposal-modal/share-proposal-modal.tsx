import { Code, Copy } from "lucide-react"
import { useEffect } from "react"
import {
	Box,
	Divider,
	Grid,
	HStack,
	Modal,
	Typography,
	VStack,
} from "#/features/ui"
import { useAnalytics } from "#/lib/analytics"
import { useTransientText } from "#/lib/hooks"
import { css } from "#/styles/styled-system/css"
import {
	ShareLink,
	ShareURL,
	blueskyDest,
	facebookDest,
	linkedinDest,
	redditDest,
	twitterDest,
	whatsappDest,
} from "../share"

function buildEmbedUrl(link: string) {
	const url = new URL(link)
	url.pathname = `${url.pathname.replace(/\/$/, "")}/embed`
	return url.toString()
}

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

const proposalDests = [
	redditDest,
	twitterDest,
	blueskyDest,
	whatsappDest,
	facebookDest,
	linkedinDest,
]

export function ShareProposalModal({
	open,
	onClose,
	title,
	link,
	eyebrow = "Share proposal",
	description,
	source,
}: {
	open: boolean
	onClose: () => void
	title: string
	link: string
	eyebrow?: string
	description?: string
	source: string
}) {
	const [copyEmbed, activateCopyEmbed] = useTransientText("Copy", "Copied!")
	const { capture } = useAnalytics()

	useEffect(() => {
		if (open) capture("proposal_share_modal_opened", { source })
	}, [open, source, capture])

	const embedCode = `<iframe src="${buildEmbedUrl(link)}" width="100%" height="500" frameborder="0" />`

	function handleCopyEmbed() {
		navigator.clipboard.writeText(embedCode).then(activateCopyEmbed)
		capture("proposal_shared", { method: "embed", source })
	}

	return (
		<Modal
			open={open}
			onClose={() => {
				capture("proposal_share_modal_dismissed", { source })
				onClose()
			}}
			size="sm"
		>
			<Modal.Header>
				<VStack gap="1">
					<Modal.Eyebrow color="coral.500">{eyebrow}</Modal.Eyebrow>
					<Modal.Title
						font="serif"
						color="stone.900"
						fontStyle="italic"
						size="lg"
						weight="light"
					>
						{title}
					</Modal.Title>
				</VStack>
				<Modal.CloseBtn />
			</Modal.Header>
			<Modal.Body>
				<VStack gap="4">
					{description && (
						<Typography.Text size="sm" color="stone.600">
							{description}
						</Typography.Text>
					)}
					<Grid cols={3} gap="2">
						{proposalDests.map((dest) => (
							<ShareLink
								key={dest.name}
								dest={dest}
								link={link}
								title={title}
								source={source}
							/>
						))}
					</Grid>
					<Divider />
					<ShareURL link={link} source={source} />
					<Divider />
					<HStack gap="2">
						<HStack gap="1" className={css({ color: "stone.500" })}>
							<Code size={12} />
							<Typography.Text size="xs" color="stone.500">
								Embed
							</Typography.Text>
						</HStack>
						<Box className={readonlyField}>
							<Typography.Text
								truncate
								font="mono"
								size="xs"
								color="stone.500"
								className={css({ px: "2.5" })}
							>
								{embedCode}
							</Typography.Text>
							<button
								type="button"
								className={css({
									flexShrink: 0,
									height: "100%",
									px: "2.5",
									borderLeft: "1px solid",
									borderLeftColor: "stone.200",
									color: { base: "stone.500", _hover: "stone.800" },
									fontSize: "xxs",
									display: "flex",
									border: "none",
									fontWeight: "medium",
									alignItems: "center",
									justifyContent: "center",
									gap: "2",
									cursor: "pointer",
									background: {
										base: "transparent",
										_hover: "stone.200",
									},
								})}
								onClick={handleCopyEmbed}
							>
								<Copy size={12} />
								{copyEmbed}
							</button>
						</Box>
					</HStack>
				</VStack>
			</Modal.Body>
		</Modal>
	)
}
