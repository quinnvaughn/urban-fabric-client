import { useApolloClient } from "@apollo/client/react"
import { useState } from "react"
import { ElementPhotoCaptionEditor, ElementPhotoCard } from "#/features/fabric"
import { Box, PhotoUploadButton, useToast } from "#/features/ui"
import {
	CreateProposalPhotoUploadUrlDocument,
	type ProposalPhotoGroup,
} from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"

export type ProposalFormPhoto = {
	id?: string
	url: string
	caption?: string
}

type UploadingPhoto = {
	id: string
	previewUrl: string
}

type Props = {
	group: ProposalPhotoGroup
	value: ProposalFormPhoto[]
	onChange: (photos: ProposalFormPhoto[]) => void
}

export function ProposalPhotoField({
	group,
	value,
	onChange,
}: Props) {
	const client = useApolloClient()
	const { toast } = useToast()
	const [uploading, setUploading] = useState<UploadingPhoto[]>([])
	const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
		null,
	)
	const selectedPhoto =
		selectedPhotoIndex == null ? null : (value[selectedPhotoIndex] ?? null)

	async function uploadOne(file: File): Promise<ProposalFormPhoto | null> {
		const previewUrl = URL.createObjectURL(file)
		const id = crypto.randomUUID()

		setUploading((prev) => [...prev, { id, previewUrl }])

		try {
			const result = await client.mutate({
				mutation: CreateProposalPhotoUploadUrlDocument,
				variables: {
					input: { group, contentType: file.type },
				},
			})

			const upload = result.data?.createProposalPhotoUploadUrl
			if (!upload || upload.__typename !== "PresignedUploadResult") {
				throw new Error("Failed to get upload URL")
			}

			await fetch(upload.uploadUrl, {
				method: "PUT",
				headers: { "Content-Type": file.type },
				body: file,
			})

			return { url: upload.publicUrl, caption: "" }
		} catch (err) {
			console.error("Proposal photo upload failed", err)
			toast({ title: "Photo upload failed", intent: "error" })
			return null
		} finally {
			setUploading((prev) => prev.filter((p) => p.id !== id))
			URL.revokeObjectURL(previewUrl)
		}
	}

	async function handleFiles(files: File[]) {
		let nextPhotos = value
		for (const file of files) {
			const uploadedPhoto = await uploadOne(file)
			if (!uploadedPhoto) continue
			nextPhotos = [...nextPhotos, uploadedPhoto]
			onChange(nextPhotos)
		}
	}

	function handleCaptionChange(index: number, caption: string) {
		onChange(
			value.map((photo, photoIndex) =>
				photoIndex === index ? { ...photo, caption } : photo,
			),
		)
	}

	function handleDelete(index: number) {
		const removedPhoto = value[index]
		if (!removedPhoto) return

		if (selectedPhotoIndex === index) {
			setSelectedPhotoIndex(null)
		} else if (selectedPhotoIndex != null && selectedPhotoIndex > index) {
			setSelectedPhotoIndex(selectedPhotoIndex - 1)
		}

		onChange(value.filter((_, photoIndex) => photoIndex !== index))
	}

	return (
		<Box
			className={css({ display: "flex", flexDirection: "column", gap: "2" })}
		>
			{(value.length > 0 || uploading.length > 0) && (
				<Box
					className={css({
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						gap: "1.5",
					})}
				>
					{value.map((photo, index) => (
						<ElementPhotoCard
							key={photo.url}
							url={photo.url}
							alt="Proposal photo"
							caption={photo.caption}
							placeholderCaption="Add caption"
							onCaptionClick={() => setSelectedPhotoIndex(index)}
							onDelete={() => handleDelete(index)}
							isSelected={selectedPhotoIndex === index}
						/>
					))}
					{uploading.map((photo) => (
						<img
							key={photo.id}
							src={photo.previewUrl}
							alt=""
							className={css({
								width: "100%",
								aspectRatio: "1",
								objectFit: "cover",
								borderRadius: "sm",
								border: "1px solid",
								borderColor: "border.subtle",
								opacity: 0.4,
							})}
						/>
					))}
				</Box>
			)}
			{selectedPhoto && (
				<ElementPhotoCaptionEditor
					key={selectedPhoto.url}
					url={selectedPhoto.url}
					alt="Proposal photo"
					caption={selectedPhoto.caption}
					onDone={(caption) => {
						if (selectedPhotoIndex == null) return
						handleCaptionChange(selectedPhotoIndex, caption)
						setSelectedPhotoIndex(null)
					}}
				/>
			)}
			<PhotoUploadButton onFiles={handleFiles}>Add photos</PhotoUploadButton>
		</Box>
	)
}
