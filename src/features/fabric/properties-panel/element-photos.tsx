import { useApolloClient } from "@apollo/client/react"
import { useParams } from "@tanstack/react-router"
import { Info, Plus } from "lucide-react"
import { useRef, useState } from "react"
import { Box, Button, Tooltip } from "#/features/ui"
import { FieldLabel } from "#/features/ui/field"
import {
	CreateFabricElementPhotoUploadUrlDocument,
	DeleteFabricElementPhotoDocument,
} from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { ElementPhotoCaptionEditor } from "../element-photo-caption-editor"
import { ElementPhotoCard } from "../element-photo-card"
import {
	type ElementInstance,
	type ElementPhoto,
	normalizeElementPhoto,
} from "../element-types/types"
import { fabricStore, updateElement } from "../fabric-store/fabric-store"

type UploadingPhoto = {
	id: string
	previewUrl: string
}

type Props = {
	element: ElementInstance
}

export function ElementPhotos({ element }: Props) {
	const client = useApolloClient()
	const { id: fabricId } = useParams({ strict: false })
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [uploading, setUploading] = useState<UploadingPhoto[]>([])
	const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
		null,
	)

	const photos = (element.photos ?? []).map(normalizeElementPhoto)
	const canUpload = !!fabricId
	const selectedPhoto =
		selectedPhotoIndex == null ? null : (photos[selectedPhotoIndex] ?? null)

	async function uploadOne(file: File, fabricId: string) {
		const previewUrl = URL.createObjectURL(file)
		const id = crypto.randomUUID()

		setUploading((prev) => [...prev, { id, previewUrl }])

		try {
			const result = await client.mutate({
				mutation: CreateFabricElementPhotoUploadUrlDocument,
				variables: {
					input: { fabricId, elementId: element.id, contentType: file.type },
				},
			})

			const upload = result.data?.createFabricElementPhotoUploadUrl
			if (!upload || upload.__typename !== "PresignedUploadResult") {
				throw new Error("Failed to get upload URL")
			}

			await fetch(upload.uploadUrl, {
				method: "PUT",
				headers: { "Content-Type": file.type },
				body: file,
			})

			const currentPhotos =
				fabricStore.state.elements.find((e) => e.id === element.id)?.photos ??
				[]
			updateElement(element.id, {
				photos: [...currentPhotos, { url: upload.publicUrl, caption: "" }],
			})
		} catch (err) {
			console.error("Photo upload failed", err)
		} finally {
			setUploading((prev) => prev.filter((p) => p.id !== id))
			URL.revokeObjectURL(previewUrl)
		}
	}

	function handleFiles(files: FileList) {
		if (!fabricId) return
		const imageFiles = Array.from(files).filter((f) =>
			f.type.startsWith("image/"),
		)
		for (const file of imageFiles) {
			uploadOne(file, fabricId)
		}
	}

	function updateStoredPhotos(nextPhotos: ElementPhoto[]) {
		updateElement(element.id, { photos: nextPhotos })
	}

	function handleCaptionChange(index: number, caption: string) {
		const currentPhotos = (
			fabricStore.state.elements.find((e) => e.id === element.id)?.photos ?? []
		).map(normalizeElementPhoto)

		updateStoredPhotos(
			currentPhotos.map((photo, photoIndex) =>
				photoIndex === index ? { ...photo, caption } : photo,
			),
		)
	}

	async function handleDelete(index: number) {
		if (!fabricId) return

		const currentPhotos = (
			fabricStore.state.elements.find((e) => e.id === element.id)?.photos ?? []
		).map(normalizeElementPhoto)
		const removedPhoto = currentPhotos[index]
		if (!removedPhoto) return

		if (selectedPhotoIndex === index) {
			setSelectedPhotoIndex(null)
		} else if (selectedPhotoIndex != null && selectedPhotoIndex > index) {
			setSelectedPhotoIndex(selectedPhotoIndex - 1)
		}

		// Optimistically remove from the store
		updateStoredPhotos(
			currentPhotos.filter((_, photoIndex) => photoIndex !== index),
		)

		try {
			const photoKey = new URL(removedPhoto.url).pathname.slice(1)
			await client.mutate({
				mutation: DeleteFabricElementPhotoDocument,
				variables: { input: { fabricId, photoKey } },
			})
		} catch (err) {
			console.error("Photo delete failed", err)
			// Restore the photo on failure
			const afterFailPhotos = (
				fabricStore.state.elements.find((e) => e.id === element.id)?.photos ??
				[]
			).map(normalizeElementPhoto)
			updateStoredPhotos([
				...afterFailPhotos.slice(0, index),
				removedPhoto,
				...afterFailPhotos.slice(index),
			])
		}
	}

	return (
		<Box
			className={css({ display: "flex", flexDirection: "column", gap: "2" })}
		>
			<FieldLabel
				as="div"
				className={css({
					display: "inline-flex",
					alignItems: "center",
					gap: "1",
				})}
			>
				Photos
				<Tooltip placement="top-end">
					<Tooltip.Trigger>
						<span
							className={css({
								display: "inline-flex",
								color: "stone.400",
								cursor: "help",
							})}
						>
							<Info size={12} />
						</span>
					</Tooltip.Trigger>
					<Tooltip.Content>
						Add photos that document this specific element. Proposal-level
						photos are managed separately.
					</Tooltip.Content>
				</Tooltip>
			</FieldLabel>
			{(photos.length > 0 || uploading.length > 0) && (
				<Box
					className={css({
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						gap: "1.5",
					})}
				>
					{photos.map((photo, index) => (
						<ElementPhotoCard
							key={photo.url}
							url={photo.url}
							alt={element.title ? `${element.title} photo` : "Element photo"}
							caption={photo.caption}
							placeholderCaption="Add caption"
							onCaptionClick={() => setSelectedPhotoIndex(index)}
							onDelete={() => handleDelete(index)}
							isSelected={selectedPhotoIndex === index}
						/>
					))}
					{uploading.map((p) => (
						<img
							key={p.id}
							src={p.previewUrl}
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
					alt={element.title ? `${element.title} photo` : "Element photo"}
					caption={selectedPhoto.caption}
					onDone={(caption) => {
						if (selectedPhotoIndex == null) return
						handleCaptionChange(selectedPhotoIndex, caption)
						setSelectedPhotoIndex(null)
					}}
				/>
			)}
			{canUpload && (
				<>
					<Button
						appearance="outline"
						intent="neutral"
						size="sm"
						fullWidth
						startIcon={<Plus size={12} />}
						onClick={() => fileInputRef.current?.click()}
						className={css({ borderStyle: "dashed" })}
					>
						Add photos
					</Button>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						multiple
						className={css({ display: "none" })}
						onChange={(e) => {
							if (e.target.files?.length) {
								handleFiles(e.target.files)
								e.target.value = ""
							}
						}}
					/>
				</>
			)}
		</Box>
	)
}
