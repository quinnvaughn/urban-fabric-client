import { Copy } from "lucide-react"
import { Box, Modal, Typography, VStack } from "#/features/ui"
import { useTransientText } from "#/lib/hooks"
import { css } from "#/styles/styled-system/css"

const readonlyField = css({
	width: "100%",
	display: "flex",
	alignItems: "stretch",
	height: "36px",
	background: "stone.100",
	border: "1px solid",
	borderColor: "stone.200",
	borderRadius: "md",
	minWidth: 0,
	color: "stone.400",
	overflow: "hidden",
})

export function EmbedCodeModal({
	open,
	onClose,
	title,
	link,
}: {
	open: boolean
	onClose: () => void
	title: string
	link: string
}) {
	const embedCode = `<iframe src="${link}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`
	const [copyText, activateCopy] = useTransientText("Copy", "Copied!")

	function handleCopy() {
		navigator.clipboard.writeText(embedCode).then(activateCopy)
	}

	return (
		<Modal open={open} onClose={onClose} size="sm">
			<Modal.Header>
				<VStack gap="1">
					<Modal.Eyebrow>Embed proposal</Modal.Eyebrow>
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
					<Typography.Text size="sm" color="stone.600">
						Paste this snippet into any webpage to embed this proposal.
					</Typography.Text>
					<Box className={readonlyField}>
						<Typography.Text
							truncate
							font="mono"
							size="xs"
							color="stone.500"
							className={css({
								px: "2.5",
								display: "flex",
								alignItems: "center",
							})}
						>
							{embedCode}
						</Typography.Text>
						<button
							type="button"
							className={css({
								flexShrink: 0,
								px: "2.5",
								borderLeft: "1px solid",
								borderLeftColor: "stone.200",
								borderTop: "none",
								borderRight: "none",
								borderBottom: "none",
								color: { base: "stone.500", _hover: "stone.800" },
								fontSize: "xxs",
								display: "flex",
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
							onClick={handleCopy}
						>
							<Copy size={12} />
							{copyText}
						</button>
					</Box>
				</VStack>
			</Modal.Body>
		</Modal>
	)
}
