import { useState } from "react"
import { ElementPhotoCard } from "#/features/fabric"
import { Box, Divider, Lightbox, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type ProposalPhoto = {
	id: string
	url: string
	caption?: string | null
}

type Props = {
	existingConditionPhotos: ProposalPhoto[]
	inspirationPhotos: ProposalPhoto[]
	scrollable?: boolean
}

type LightboxState = {
	photos: ProposalPhoto[]
	index: number
	groupLabel: string
} | null

export function ProposalPhotosTab({
	existingConditionPhotos,
	inspirationPhotos,
	scrollable = true,
}: Props) {
	const [lightboxState, setLightboxState] = useState<LightboxState>(null)

	function getLightboxCaption(photo: ProposalPhoto, groupLabel: string) {
		return photo.caption ? `${groupLabel} · ${photo.caption}` : groupLabel
	}

	function renderPhotoGrid(groupPhotos: ProposalPhoto[], groupLabel: string) {
		if (groupPhotos.length === 0) {
			return (
				<Typography.Text size="sm" color="stone.400" fontStyle="italic">
					No photos in this group.
				</Typography.Text>
			)
		}

		return (
			<Box
				className={css({
					display: "grid",
					gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
					gap: "2",
				})}
			>
				{groupPhotos.map((photo, index) => (
					<ElementPhotoCard
						key={photo.id}
						url={photo.url}
						alt="Proposal photo"
						caption={photo.caption ?? ""}
						onCaptionClick={() =>
							setLightboxState({ photos: groupPhotos, index, groupLabel })
						}
					/>
				))}
			</Box>
		)
	}

	return (
		<VStack
			gap="4"
			className={css({
				py: "4",
				px: "5",
				flex: 1,
				overflowY: scrollable ? "auto" : "visible",
			})}
		>
			<VStack gap="2.5">
				<Divider label="Existing Conditions" />
				{renderPhotoGrid(existingConditionPhotos, "Existing conditions")}
			</VStack>
			<VStack gap="2.5">
				<Divider label="Inspiration & References" />
				{renderPhotoGrid(inspirationPhotos, "Inspiration & References")}
			</VStack>
			{lightboxState && (
				<Lightbox
					photos={lightboxState.photos.map((photo) => ({
						src: photo.url,
						caption: getLightboxCaption(photo, lightboxState.groupLabel),
						alt: "Proposal photo",
					}))}
					initialIndex={lightboxState.index}
					onClose={() => setLightboxState(null)}
				/>
			)}
		</VStack>
	)
}
