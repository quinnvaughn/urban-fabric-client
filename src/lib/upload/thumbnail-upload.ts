import type { ApolloClient } from "@apollo/client/core"
import {
	CreateFabricThumbnailUploadUrlDocument,
	CreateProposalThumbnailUploadUrlDocument,
} from "#/graphql/generated"

function getContentType(blob: Blob) {
	return blob.type || "image/webp"
}

async function uploadToPresignedUrl(uploadUrl: string, blob: Blob) {
	const response = await fetch(uploadUrl, {
		method: "PUT",
		headers: {
			"Content-Type": getContentType(blob),
		},
		body: blob,
	})

	if (!response.ok) {
		throw new Error(`Thumbnail upload failed with status ${response.status}`)
	}
}

export async function uploadFabricThumbnail(client: ApolloClient, blob: Blob) {
	const response = await client.mutate({
		mutation: CreateFabricThumbnailUploadUrlDocument,
		variables: {
			input: { contentType: getContentType(blob) },
		},
	})

	const upload = response.data?.createFabricThumbnailUploadUrl
	if (!upload) throw new Error("Missing thumbnail upload response")
	await uploadToPresignedUrl(upload.uploadUrl, blob)
	return upload.publicUrl
}

export async function uploadProposalThumbnail(
	client: ApolloClient,
	blob: Blob,
) {
	const response = await client.mutate({
		mutation: CreateProposalThumbnailUploadUrlDocument,
		variables: {
			input: { contentType: getContentType(blob) },
		},
	})

	const upload = response.data?.createProposalThumbnailUploadUrl
	if (!upload || upload.__typename !== "PresignedUploadResult") {
		throw new Error("Failed to get presigned upload URL")
	}
	await uploadToPresignedUrl(upload.uploadUrl, blob)
	return upload.publicUrl
}
