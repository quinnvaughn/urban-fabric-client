import { Link } from "@tanstack/react-router"
import { ChevronRight, MapIcon } from "lucide-react"
import { useFabricStore } from "#/features/fabric/fabric-store"
import { Box, Button, Menu } from "#/features/ui"
import { MapStyle } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"
import { BackButton } from "../back-button"
import { EditorTitleInput } from "./editor-title-input"
import { SaveIndicator } from "./save-indicator"

const MAP_STYLE_LABELS: Record<MapStyle, string> = {
	[MapStyle.Default]: "Default",
	[MapStyle.Dark]: "Dark",
	[MapStyle.Light]: "Light",
	[MapStyle.Satellite]: "Satellite",
}

const MAP_STYLE_ORDER: MapStyle[] = [
	MapStyle.Default,
	MapStyle.Dark,
	MapStyle.Light,
	MapStyle.Satellite,
]

type BaseProps = {
	title: string
	id: string
	onTitleSave: (title: string) => Promise<void>
	onPublish?: () => Promise<void> | void
	onSave?: () => void
	mapStyle: MapStyle
	onMapStyleChange: (style: MapStyle) => void
}

type Props =
	| (BaseProps & { hasProposal: true; slug: string })
	| (BaseProps & { hasProposal: false; slug?: never })

const InnerText = ({ hasProposal }: { hasProposal: boolean }) => (
	<>
		{hasProposal ? "Update" : "Publish"} proposal <ChevronRight size={12} />
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
	mapStyle,
	onMapStyleChange,
}: Props) {
	const { saveStatus, elements } = useFabricStore()
	const hasElements = elements.length > 0
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
				<Menu placement="bottom-end">
					<Menu.Trigger>
						<Button type="button" intent="neutral" size="sm" appearance="outline">
							<MapIcon size={14} />
							Map style
						</Button>
					</Menu.Trigger>
					<Menu.Content>
						{MAP_STYLE_ORDER.map((style) => (
							<Menu.CheckItem
								key={style}
								checked={mapStyle === style}
								onCheckedChange={() => onMapStyleChange(style)}
							>
								{MAP_STYLE_LABELS[style]}
							</Menu.CheckItem>
						))}
					</Menu.Content>
				</Menu>
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
