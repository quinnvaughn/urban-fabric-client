import { ChevronLeft, MapPin } from "lucide-react"
import { DateTime } from "luxon"
import { useEffect } from "react"
import * as ReactDOM from "react-dom"
import { FabricMap } from "#/features/fabric"
import { Attribution } from "#/features/fabric/attribution"
import type { ElementInstance } from "#/features/fabric/element-types/types"
import { MapControls } from "#/features/fabric/map-controls"
import {
	ProposalAboutTab,
	ProposalPanelAuthor,
	ProposalPanelCategories,
	ProposalPanelHeader,
	ProposalPanelMeta,
	ProposalPanelTabs,
} from "#/features/proposal/proposal-content"
import { ProposalElementsLayer } from "#/features/proposal/proposal-elements-layer"
import { ProposalSelectLayer } from "#/features/proposal/proposal-select-layer"
import { useProposalStore } from "#/features/proposal/proposal-store"
import { SelectedInstancePanel } from "#/features/proposal/selected-instance-panel"
import {
	Badge,
	Box,
	Button,
	HStack,
	Logo,
	Tooltip,
	Typography,
	VStack,
} from "#/features/ui"
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
						<Tooltip placement="bottom">
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
	const { activeTab, setActiveTab, elements } = useProposalStore()

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
			<VStack gap="3">
				<ProposalPanelHeader title={data.title} paddingTop="5" />
				<Box className={css({ px: "5" })}>
					<VStack gap="3">
						<ProposalPanelAuthor name={data.creatorName} />
						<ProposalPanelMeta
							dateLabel={DateTime.now().toLocaleString(DateTime.DATE_MED)}
							locationLabel={locationString}
							viewCount={0}
						/>
						<ProposalPanelCategories categories={data.categories} />
						<ProposalPanelTabs
							activeTab={activeTab}
							onValueChange={setActiveTab}
						/>
					</VStack>
				</Box>
			</VStack>
			{activeTab === "about" ? (
				<ProposalAboutTab
					description={data.description}
					elements={elements}
					emptyDescriptionText="No description yet."
				/>
			) : (
				<Box className={css({ flex: 1, overflowY: "auto", px: "5", py: "4" })}>
					<Typography.Text size="sm" color="stone.500">
						Comments will appear here.
					</Typography.Text>
				</Box>
			)}
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
