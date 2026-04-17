import type maplibregl from "maplibre-gl"
import { useEffect, useRef, useState } from "react"
import { FabricMap, MapControls } from "#/features/fabric"
import { Attribution } from "#/features/fabric/attribution"
import { PublicNavActions } from "#/features/navigation"
import {
	ProposalCommentLocationHighlight,
	ProposalCommentLocationPicker,
	useCommentComposerStore,
} from "#/features/proposal-comment"
import { Box, HStack, Typography } from "#/features/ui"
import type { GetProposalQuery } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { downloadProposalMapImage } from "../download-proposal-map-image"
import { LikeProposalButton } from "../like-proposal-button"
import { ProposalBrandMenu } from "../proposal-brand-menu"
import { ProposalContent } from "../proposal-content"
import { ProposalElementsLayer } from "../proposal-elements-layer"
import { ProposalSelectLayer } from "../proposal-select-layer"
import { ProposalSheet } from "../proposal-sheet"
import { useProposalStore } from "../proposal-store"
import { SelectedInstancePanel } from "../selected-instance-panel"
import { ShareProposalButton } from "../share-proposal-button"

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

export function ProposalMobileView({
	proposal,
	forceCommentsOpen = false,
}: {
	proposal: Proposal
	forceCommentsOpen?: boolean
}) {
	const { selectedInstance, setSelectedInstanceId } = useProposalStore()
	const { isPickingLocation } = useCommentComposerStore()
	const [map, setMap] = useState<maplibregl.Map | null>(null)
	const [sheetOpen, setSheetOpen] = useState(false)
	const sheetOpenBeforeSelection = useRef(false)
	const wasPickingLocation = useRef(false)

	// When an element is selected, save sheet state and open it.
	// When deselected, restore to whatever it was before.
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (selectedInstance) {
			sheetOpenBeforeSelection.current = sheetOpen
			setSheetOpen(true)
		} else {
			setSheetOpen(sheetOpenBeforeSelection.current)
		}
	}, [selectedInstance?.id])

	useEffect(() => {
		if (selectedInstance) return

		if (isPickingLocation) {
			wasPickingLocation.current = true
			setSheetOpen(false)
			return
		}

		if (wasPickingLocation.current) {
			wasPickingLocation.current = false
			setSheetOpen(true)
		}
	}, [isPickingLocation, selectedInstance])

	useEffect(() => {
		if (!forceCommentsOpen) return
		if (selectedInstance || isPickingLocation) return

		setSheetOpen(true)
	}, [forceCommentsOpen, isPickingLocation, selectedInstance])

	// When user manually closes the sheet, clear selection and mark
	// pre-selection state as closed so it doesn't reopen on deselect.
	const handleSheetOpenChange = (open: boolean) => {
		if (!open) {
			sheetOpenBeforeSelection.current = false
			setSelectedInstanceId("")
		}
		setSheetOpen(open)
	}

	return (
		<Box
			className={css({
				display: { base: "flex", md: "none" },
				flexDirection: "column",
				h: "100dvh",
				w: "screen",
				position: "relative",
				overflow: "hidden",
			})}
		>
			{/* Minimal header — logo + nav only, no title/location */}
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
				<ProposalBrandMenu
					proposalId={proposal.id}
					source="proposal_mobile_header_menu"
					downloadDisabled={!map}
					onDownloadImage={() => {
						if (!map) return Promise.reject(new Error("Map is not ready"))
						return downloadProposalMapImage({ map, title: proposal.title })
					}}
				/>
				<PublicNavActions authenticatedAction="new-fabric" />
			</Box>

			{/* Map — fills remaining space; sheet overlays it from below */}
			<Box
				className={css({
					flex: 1,
					position: "relative",
					minH: 0,
					overflow: "hidden",
				})}
			>
				<FabricMap
					center={[proposal.snapshotCenter.lng, proposal.snapshotCenter.lat]}
					zoom={proposal.snapshotZoom}
					mapStyle={proposal.snapshotMapStyle}
					onMapChange={setMap}
				>
					<ProposalCommentLocationHighlight />
					<ProposalCommentLocationPicker />
					<ProposalSelectLayer />
					{/*
					 * Controls sit above the peek height.
					 * peekHeight = 80px, plus 20px breathing room = 100px.
					 */}
					<Box
						className={css({
							position: "absolute",
							bottom: "100px",
							left: "20px",
							right: "20px",
							zIndex: "panel",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "end",
						})}
					>
						<Attribution />
						<MapControls showHelp={false} showGetCurrentLocation={false} />
					</Box>
					<ProposalElementsLayer />
				</FabricMap>
			</Box>

			{/* Sheet — overlays map, shows proposal details and selected element details */}
			<ProposalSheet
				open={isPickingLocation ? false : sheetOpen}
				onOpenChange={handleSheetOpenChange}
				fullscreen={!selectedInstance && !isPickingLocation}
				peek={
					!selectedInstance && (
						<>
							<Typography.Text
								size="md"
								weight="medium"
								color="stone.800"
								truncate
								className={css({ flex: 1 })}
							>
								{proposal.title}
							</Typography.Text>
							<HStack align="center" gap="1">
								<LikeProposalButton proposal={proposal} isMobile />
								<ShareProposalButton proposal={proposal} />
							</HStack>
						</>
					)
				}
			>
				{selectedInstance ? (
					<SelectedInstancePanel
						instance={selectedInstance}
						onClose={() => setSelectedInstanceId("")}
					/>
				) : (
					<ProposalContent proposal={proposal} isMobile />
				)}
			</ProposalSheet>
		</Box>
	)
}
