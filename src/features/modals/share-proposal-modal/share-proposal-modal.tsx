import { Check, Copy, Link } from "lucide-react"
import type * as React from "react"
import {
	Box,
	Button,
	Divider,
	Grid,
	HStack,
	Modal,
	Typography,
	VStack,
} from "#/features/ui"
import { useTransientText } from "#/lib/hooks/use-transient-text"
import { css } from "#/styles/styled-system/css"

type ShareDest = {
	link: string
	color: string
	name: string
	icon: React.ReactNode
}

const shareDest: ShareDest[] = [
	{
		name: "Reddit",
		color: "#FF4500",
		icon: (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="white">
				<title>Reddit</title>
				<path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"></path>
			</svg>
		),
		link: "https://www.reddit.com/submit?url={url}&title={title}",
	},
	{
		name: "X / Twitter",
		color: "#000",
		icon: (
			<svg width="14" height="14" viewBox="0 0 24 24" fill="white">
				<title>Twitter</title>
				<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
			</svg>
		),
		link: "https://twitter.com/intent/tweet?url={url}&text={title}",
	},
	{
		name: "Bluesky",
		color: "#1DA1F2",
		icon: (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="white">
				<title>Bluesky</title>
				<path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.689-.139-1.861-.902-2.204-.659-.299-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"></path>
			</svg>
		),
		link: "https://bsky.app/intent/compose?text={title}%20{url}",
	},
	{
		name: "WhatsApp",
		color: "#25D366",
		icon: (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="white">
				<title>WhatsApp</title>
				<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"></path>
			</svg>
		),
		link: "https://wa.me/?text={title}%20{url}",
	},
	{
		name: "Facebook",
		color: "#1877F2",
		icon: (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="white">
				<title>Facebook</title>
				<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
			</svg>
		),
		link: "https://www.facebook.com/sharer/sharer.php?u={url}",
	},
	{
		name: "LinkedIn",
		color: "#0a66c2",
		icon: (
			<svg width="15" height="15" viewBox="0 0 24 24" fill="white">
				<title>LinkedIn</title>
				<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
			</svg>
		),
		link: "https://www.linkedin.com/sharing/share-offsite/?url={url}",
	},
]

export function ShareProposalModal({
	open,
	onClose,
	title,
	link,
	eyebrow = "Share proposal",
	description,
}: {
	open: boolean
	onClose: () => void
	title: string
	link: string
	eyebrow?: string
	description?: string
}) {
	const [copyText, activateCopy] = useTransientText("Copy Link", "Copied!")

	function handleCopy() {
		navigator.clipboard.writeText(link).then(activateCopy)
	}

	return (
		<Modal open={open} onClose={onClose} size="sm">
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
						{shareDest.map((dest) => (
							<a
								key={dest.name}
								href={dest.link
									.replace("{url}", encodeURIComponent(link))
									.replace("{title}", encodeURIComponent(title))}
								target="_blank"
								rel="noopener noreferrer"
								className={css({
									display: "flex",
									flexDir: "column",
									alignItems: "center",
									gap: "2",
									py: "2",
									paddingTop: "3",
									paddingBottom: "2.5",
									borderRadius: "md",
									background: { base: "stone.50", _hover: "stone.100" },
									border: "1px solid",
									borderColor: { base: "stone.200", _hover: "stone.300" },
									textDecoration: "none",
									cursor: "pointer",
									transition:
										"background 150ms var(--easings-in-out), border-color 150ms",
								})}
							>
								<Box
									style={{ background: dest.color }}
									className={css({
										width: "9",
										height: "9",
										borderRadius: "md",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexShrink: 0,
									})}
								>
									{dest.icon}
								</Box>
								<Typography.Text size="xs" weight="medium" color="stone.700">
									{dest.name}
								</Typography.Text>
							</a>
						))}
					</Grid>
					<Divider />
					<HStack gap="2" align="center">
						<Box
							className={css({
								flex: 1,
								display: "flex",
								alignItems: "center",
								gap: "2",
								height: "38px",
								background: "stone.100",
								border: "1px solid",
								borderColor: "stone.200",
								borderRadius: "md",
								minWidth: 0,
								color: "stone.400",
								px: "3",
							})}
						>
							<Link size={11} />
							<Typography.Text truncate size="xs" color="stone.600">
								{window.location.href}
							</Typography.Text>
						</Box>
						<Button
							size="sm"
							intent="brand"
							startIcon={
								copyText === "Copied!" ? (
									<Check size={12} />
								) : (
									<Copy size={12} />
								)
							}
							onClick={handleCopy}
						>
							{copyText}
						</Button>
					</HStack>
				</VStack>
			</Modal.Body>
		</Modal>
	)
}
