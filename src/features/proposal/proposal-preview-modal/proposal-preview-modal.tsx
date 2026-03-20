import { ChevronLeft, Eye, MapPin } from "lucide-react"
import { DateTime } from "luxon"
import { useEffect } from "react"
import * as ReactDOM from "react-dom"
import { FabricComposition, FabricMap } from "#/features/fabric"
import { Attribution } from "#/features/fabric/attribution"
import type { ElementInstance } from "#/features/fabric/element-types/types"
import { MapControls } from "#/features/fabric/map-controls"
import { ProposalElementsLayer } from "#/features/proposal/proposal-elements-layer"
import { ProposalSelectLayer } from "#/features/proposal/proposal-select-layer"
import { useProposalStore } from "#/features/proposal/proposal-store"
import { SelectedInstancePanel } from "#/features/proposal/selected-instance-panel"
import {
	Avatar,
	Badge,
	Box,
	Button,
	Divider,
	HStack,
	Logo,
	Swatch,
	Tabs,
	Tooltip,
	Typography,
	VStack,
} from "#/features/ui"
import { enumValueToReadableLabel } from "#/lib/string"
import { css } from "#/styles/styled-system/css"

export type ProposalPreviewData = {
	title: string
	description: string
	categories: string[]
	elements: ElementInstance[]
	center: { lat: number; lng: number }
	zoom: number
	location?: { city: string; region: string; regionAbbr?: string | null }
	creatorName: string
}

type Props = {
	open: boolean
	onClose: () => void
	data: ProposalPreviewData
}

export function ProposalPreviewModal({ open, onClose, data }: Props) {
	const { initElements } = useProposalStore()

	useEffect(() => {
		if (open) {
			initElements(data.elements)
		}
	}, [open, data.elements, initElements])

	// Close on Escape
	useEffect(() => {
		if (!open) return
		function handleKey(e: KeyboardEvent) {
			if (e.key === "Escape") onClose()
		}
		document.addEventListener("keydown", handleKey)
		return () => document.removeEventListener("keydown", handleKey)
	}, [open, onClose])

	// Lock body scroll
	useEffect(() => {
		if (!open) return
		const prev = document.body.style.overflow
		document.body.style.overflow = "hidden"
		return () => {
			document.body.style.overflow = prev
		}
	}, [open])

	if (!open) return null

	const locationString = data.location
		? `${data.location.city}, ${data.location.regionAbbr ?? data.location.region}`
		: "Location unavailable"

	return ReactDOM.createPortal(
		<Box
			className={css({
				position: "fixed",
				inset: 0,
				zIndex: "overlay",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "rgba(0, 0, 0, 0.4)",
				padding: "3",
			})}
		>
			<Box
				className={css({
					display: "flex",
					flexDirection: "column",
					width: "100%",
					height: "100%",
					background: "stone.100",
					borderRadius: "xl",
					overflow: "hidden",
					boxShadow: "2xl",
				})}
			>
				{/* Topbar */}
				<Box
					as="header"
					className={css({
						flexShrink: 0,
						height: "var(--uf-header-height)",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						px: "4",
						gap: "2.5",
						borderBottom: "1px solid",
						borderBottomColor: "border.subtle",
						background: "white",
						zIndex: "floating",
					})}
				>
					<HStack
						gap="2.5"
						align="center"
						className={css({ flex: 1, minWidth: 0 })}
					>
						<Logo />
						<Box
							className={css({
								width: "px",
								height: "18px",
								background: "stone.200",
								flexShrink: 0,
							})}
						/>
						<Typography.Text
							truncate
							color="stone.700"
							weight="medium"
							size="md"
						>
							{data.title}
						</Typography.Text>
						<HStack
							gap="1"
							align="center"
							className={css({ flexShrink: 0, color: "stone.500" })}
						>
							<MapPin size={10} />
							<Typography.Text size="xs" className={css({ color: "inherit" })}>
								{locationString}
							</Typography.Text>
						</HStack>
					</HStack>
					<HStack gap="2" align="center">
						<Badge
							size="xs"
							tone="warning"
							className={css({ alignSelf: "center" })}
						>
							Preview
						</Badge>
						<Tooltip side="bottom">
							<Tooltip.Trigger>
								<Button
									appearance="outline"
									intent="neutral"
									size="sm"
									onClick={onClose}
								>
									<ChevronLeft size={14} />
									Back to editing
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>Close preview</Tooltip.Content>
						</Tooltip>
					</HStack>
				</Box>

				{/* Shell */}
				<Box
					className={css({
						flex: 1,
						position: "relative",
						minH: 0,
						overflow: "hidden",
					})}
				>
					<PreviewPanel data={data} locationString={locationString} />
					<PreviewSelectedInstancePanel />
					<FabricMap
						center={[data.center.lng, data.center.lat]}
						zoom={data.zoom}
					>
						<ProposalSelectLayer />
						<Box
							className={css({
								position: "absolute",
								bottom: "20px",
								left: "20px",
								right: "20px",
								zIndex: "panel",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "end",
							})}
						>
							<Attribution />
							<MapControls showHelp={false} />
						</Box>
						<ProposalElementsLayer />
					</FabricMap>
				</Box>
			</Box>
		</Box>,
		document.body,
	)
}

function PreviewSelectedInstancePanel() {
	const { selectedInstance, setSelectedInstanceId } = useProposalStore()

	return (
		<Box
			className={css({
				position: "absolute",
				top: 0,
				right: 0,
				width: "280px",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				background: "white",
				borderLeft: "1px solid",
				borderLeftColor: "border.subtle",
				transform: selectedInstance ? "translateX(0)" : "translateX(100%)",
				opacity: selectedInstance ? 1 : 0,
				transition:
					"transform 280ms var(--easings-spring), opacity 200ms var(--easings-in-out)",
				zIndex: "floating",
			})}
		>
			{selectedInstance && (
				<SelectedInstancePanel
					instance={selectedInstance}
					onClose={() => setSelectedInstanceId("")}
				/>
			)}
		</Box>
	)
}

function PreviewPanel({
	data,
	locationString,
}: {
	data: ProposalPreviewData
	locationString: string
}) {
	const { activeTab, setActiveTab, activeElementTypes, elements } =
		useProposalStore()

	return (
		<Box
			id="preview-panel"
			className={css({
				position: "absolute",
				top: 0,
				left: 0,
				width: "360px",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				background: "white",
				borderRight: "1px solid",
				borderRightColor: "border.subtle",
				zIndex: "floating",
			})}
		>
			<Box
				className={css({
					flexShrink: 0,
					px: "5",
					paddingTop: "5",
				})}
			>
				<VStack gap="3">
					<VStack gap="1">
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
						>
							{data.title}
						</Typography.Heading>
					</VStack>
					<HStack align="center" gap="2" wrap>
						<Avatar size="xs" name={data.creatorName} />
						<Typography.Text size="sm" color="stone.700" weight="medium">
							{data.creatorName}
						</Typography.Text>
					</HStack>
					<HStack gap="2" wrap>
						<Typography.Text size="sm" color="stone.500">
							{DateTime.now().toLocaleString(DateTime.DATE_MED)}
						</Typography.Text>
						<Box
							className={css({
								width: "3px",
								height: "3px",
								background: "stone.300",
								borderRadius: "full",
							})}
						/>
						<Typography.Text size="sm" color="stone.500">
							{locationString}
						</Typography.Text>
						<Box
							className={css({
								width: "3px",
								height: "3px",
								background: "stone.300",
								borderRadius: "full",
							})}
						/>
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
								className={css({ display: "inline-block", marginLeft: "2px" })}
							/>
							0
						</Box>
					</HStack>
					{data.categories.length > 0 && (
						<HStack gap="1" wrap>
							{data.categories.map((category) => (
								<Badge key={category} size="xs" tone="accent">
									{enumValueToReadableLabel(category)}
								</Badge>
							))}
						</HStack>
					)}
					<Tabs
						stretch
						value={activeTab}
						onValueChange={(value) => setActiveTab(value as "about" | "legend")}
					>
						<Tabs.List>
							<Tabs.Trigger value="about">About</Tabs.Trigger>
							<Tabs.Trigger value="legend">Legend</Tabs.Trigger>
						</Tabs.List>
					</Tabs>
				</VStack>
			</Box>
			<Box className={css({ flex: 1, overflowY: "auto", px: "5", py: "4" })}>
				<VStack gap="0">
					{activeTab === "about" ? (
						<VStack gap="2.5">
							<Divider label="Description" />
							<Typography.Text
								color="stone.700"
								size="md"
								lineHeight="relaxed"
								className={css({ whiteSpace: "pre-wrap" })}
							>
								{data.description || (
									<Typography.Inline color="stone.400" fontStyle="italic">
										No description yet.
									</Typography.Inline>
								)}
							</Typography.Text>
							<FabricComposition elements={elements} />
						</VStack>
					) : (
						<VStack>
							<Divider label="Element Types" />
							{activeElementTypes.map((type) => (
								<HStack key={type.id} gap="3">
									<Swatch size="3.5" color={type.baseMapStyle.color} />
									<Typography.Text size="sm" color="stone.800">
										{type.title}
									</Typography.Text>
								</HStack>
							))}
						</VStack>
					)}
				</VStack>
			</Box>
			<Box
				className={css({
					flexShrink: 0,
					borderTop: "1px solid",
					borderTopColor: "border.subtle",
					px: "5",
					py: "3",
					display: "flex",
					alignItems: "center",
					gap: "1.5",
				})}
			>
				<Typography.Text size="xs" color="stone.400" fontStyle="italic">
					Like and share will be available after publishing.
				</Typography.Text>
			</Box>
		</Box>
	)
}
