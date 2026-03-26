import { Link } from "@tanstack/react-router"
import { ChevronDown, ChevronRight, MapIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useFabricStore } from "#/features/fabric/fabric-store"
import { Box, Button, Menu, Typography } from "#/features/ui"
import { MapStyle } from "#/graphql/generated"
import { useCurrentUser } from "#/lib/graphql"
import { useModalStore } from "#/stores"
import { css } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"
import { getFabricShortcutHint } from "../keyboard-shortcuts"
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
	const { saveStatus, elements, openCommandPalette, commandPaletteOpen } =
		useFabricStore()
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const { open, current: currentModal } = useModalStore()
	const { data: userData } = useCurrentUser()
	const hasElements = elements.length > 0
	const isSaving = saveStatus === "saving" || saveStatus === "dirty"
	const isPublishDisabled = isSaving || !hasElements

	// close dropdown when command palette or any modal is opened
	useEffect(() => {
		if (commandPaletteOpen || currentModal) setIsDropdownOpen(false)
	}, [commandPaletteOpen, currentModal])

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
					gap: "3",
					flex: 1,
					minWidth: 0,
				})}
			>
				<Menu
					placement="bottom-start"
					open={isDropdownOpen}
					onOpenChange={setIsDropdownOpen}
				>
					<Menu.Trigger>
						<Button
							size="xs"
							appearance="ghost"
							intent="neutral"
							data-open={isDropdownOpen || undefined}
							className={css({
								"&[data-open]": { backgroundColor: "stone.100" },
							})}
						>
							<Typography.Text weight="bold" size="lg">
								Urban Fabric
							</Typography.Text>
							<ChevronDown
								size={12}
								className={css({
									transition: "transform 0.2s",
									transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
								})}
							/>
						</Button>
					</Menu.Trigger>
					<Menu.Content>
						<Menu.Link to={userData?.me ? "/dashboard" : "/"}>Home</Menu.Link>
						<Menu.Item
							kbd={getFabricShortcutHint("openCommandPalette")}
							onClick={openCommandPalette}
						>
							Command Palette
						</Menu.Item>
						<Menu.Separator />
						<Menu.Item onClick={() => open("gettingStarted")}>
							Getting Started
						</Menu.Item>
						<Menu.Separator />
						<Menu.Item
							kbd={getFabricShortcutHint("openShortcuts")}
							onClick={() => open("shortcuts")}
						>
							Keyboard Shortcuts
						</Menu.Item>
						<Menu.Item onClick={() => open("toolRef")}>
							Tool reference
						</Menu.Item>
					</Menu.Content>
				</Menu>
				<EditorTitleInput id={id} title={title} onTitleSave={onTitleSave} />
			</Box>
			<SaveIndicator />
			<Box className={css({ flexShrink: 0, display: "flex", gap: "2" })}>
				<Menu placement="bottom-end">
					<Menu.Trigger>
						<Button
							type="button"
							intent="neutral"
							size="sm"
							appearance="outline"
						>
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
