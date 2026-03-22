import { Link } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { FabricMap, MapControls } from "#/features/fabric"
import { Attribution } from "#/features/fabric/attribution"
import { PublicNavActions } from "#/features/navigation"
import { Box, HStack, Logo, Typography } from "#/features/ui"
import type { GetProposalQuery } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { LikeProposalButton } from "../like-proposal-button"
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

export function ProposalMobileView({ proposal }: { proposal: Proposal }) {
	const { selectedInstance, setSelectedInstanceId } = useProposalStore()
	const [sheetOpen, setSheetOpen] = useState(false)
	const sheetOpenBeforeSelection = useRef(false)

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
				<Link to="/">
					<Logo />
				</Link>
				<PublicNavActions authenticatedAction="dashboard-and-new-fabric" />
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
				>
					<ProposalSelectLayer />
					{/*
					 * Controls sit above the peek height.
					 * peekHeight="sm" = 60px, plus 20px breathing room = 80px.
					 */}
					<Box
						className={css({
							position: "absolute",
							bottom: "80px",
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

			{/* Sheet — overlays map, shows proposal details and selected element details */}
			<ProposalSheet
				open={sheetOpen}
				onOpenChange={handleSheetOpenChange}
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
								<ShareProposalButton proposal={proposal} isMobile />
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
