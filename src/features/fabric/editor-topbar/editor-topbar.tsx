import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { useFabricStore } from "#/features/fabric/fabric-store"
import { Box, Button } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"
import { BackButton } from "../back-button"
import { EditorTitleInput } from "./editor-title-input"
import { SaveIndicator } from "./save-indicator"

type BaseProps = {
	title: string
	id: string
	onTitleSave: (title: string) => Promise<void>
	onPublish?: () => Promise<void> | void
	onSave?: () => void
}

type Props =
	| (BaseProps & { hasProposal: true; slug: string })
	| (BaseProps & { hasProposal: false; slug?: never })

const InnerText = ({ hasProposal }: { hasProposal: boolean }) => (
	<>
		{hasProposal ? "Edit" : "Publish"} proposal <ChevronRight size={12} />
	</>
)

export function EditorTopbar({
	title,
	id,
	onTitleSave,
	onPublish,
	onSave,
	hasProposal,
	slug,
}: Props) {
	const saveStatus = useFabricStore((state) => state.saveStatus)
	const hasElements = useFabricStore((state) => state.elements.length > 0)
	const isSaving = saveStatus === "saving" || saveStatus === "dirty"
	const isPublishDisabled = isSaving || !hasElements
	return (
		<header
			className={css({
				height: "var(--uf-topbar-height)",
				borderBottomStyle: "solid",
				borderBottomWidth: "1px",
				borderBottomColor: "border.default",
				background: "white",
				position: "fixed",
				top: 0,
				left: 0,
				zIndex: "sticky",
				inset: "0 0 auto 0",
				display: "flex",
				alignItems: "center",
				px: "4",
				gap: "2.5",
			})}
		>
			<Box
				className={css({
					display: "flex",
					alignItems: "center",
					gap: "2.5",
					flex: 1,
					minWidth: 0,
				})}
			>
				<BackButton />
				<Box
					className={css({
						width: "px",
						height: "18px",
						background: "stone.200",
						flexShrink: 0,
					})}
				/>
				<EditorTitleInput id={id} title={title} onTitleSave={onTitleSave} />
			</Box>
			<SaveIndicator />
			<Box className={css({ flexShrink: 0, display: "flex", gap: "2" })}>
				{onPublish ? (
					<>
						{onSave && (
							<Button type="button" intent="neutral" size="sm" onClick={onSave}>
								Save to account
							</Button>
						)}
						<Button
							type="button"
							intent="brand"
							size="sm"
							onClick={onPublish}
							disabled={isPublishDisabled}
						>
							<InnerText hasProposal={hasProposal} />
						</Button>
					</>
				) : (
					<Link
						to={hasProposal ? "/proposal/$slug/edit" : "/fabric/$id/publish"}
						params={hasProposal ? { slug } : { id }}
						className={button({
							appearance: "solid",
							intent: "brand",
							size: "sm",
						})}
						data-disabled={isPublishDisabled ? "" : undefined}
						aria-disabled={isPublishDisabled}
						tabIndex={isPublishDisabled ? -1 : undefined}
						onClick={(event) => {
							if (isPublishDisabled) event.preventDefault()
						}}
					>
						<InnerText hasProposal={hasProposal} />
					</Link>
				)}
			</Box>
		</header>
	)
}
