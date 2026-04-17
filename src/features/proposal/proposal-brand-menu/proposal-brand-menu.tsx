import { ChevronDown, Download } from "lucide-react"
import { useState } from "react"
import { Button, Logo, Menu, Typography, useToast } from "#/features/ui"
import { useAnalytics } from "#/lib/analytics"
import { useCurrentUser } from "#/lib/graphql"
import { css } from "#/styles/styled-system/css"

type Props = {
	proposalId: string
	source: string
	onDownloadImage: () => Promise<void>
	downloadDisabled?: boolean
}

export function ProposalBrandMenu({
	proposalId,
	source,
	onDownloadImage,
	downloadDisabled,
}: Props) {
	const [open, setOpen] = useState(false)
	const [isDownloading, setIsDownloading] = useState(false)
	const { user } = useCurrentUser()
	const { capture } = useAnalytics()
	const toast = useToast()

	async function handleDownloadImage() {
		if (downloadDisabled || isDownloading) return

		setIsDownloading(true)
		try {
			await onDownloadImage()
			capture("proposal_image_downloaded", {
				proposal_id: proposalId,
				source,
			})
			toast.success("Image downloaded")
		} catch {
			toast.error("Unable to download image")
		} finally {
			setIsDownloading(false)
		}
	}

	return (
		<Menu placement="bottom-start" open={open} onOpenChange={setOpen}>
			<Menu.Trigger>
				<Button
					size="xs"
					appearance="ghost"
					intent="neutral"
					data-open={open || undefined}
					className={css({
						px: "1.5",
						"&[data-open]": { backgroundColor: "stone.100" },
					})}
				>
					<Logo size="lg" />
					<ChevronDown
						size={12}
						className={css({
							transition: "transform 0.2s",
							transform: open ? "rotate(180deg)" : "rotate(0deg)",
						})}
					/>
				</Button>
			</Menu.Trigger>
			<Menu.Content>
				<Menu.Link to={user ? "/dashboard" : "/"}>Home</Menu.Link>
				<Menu.Link to={"/explore"}>Explore Proposals</Menu.Link>
				<Menu.Separator />
				<Menu.Item
					icon={<Download size={14} />}
					disabled={downloadDisabled || isDownloading}
					onClick={() => void handleDownloadImage()}
				>
					<Typography.Text size="sm">
						{isDownloading ? "Downloading..." : "Download image"}
					</Typography.Text>
				</Menu.Item>
			</Menu.Content>
		</Menu>
	)
}
