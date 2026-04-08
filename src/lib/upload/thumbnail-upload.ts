import type { ApolloClient } from "@apollo/client/core"
import {
	CreateFabricThumbnailUploadUrlDocument,
	type CreateFabricThumbnailUploadUrlMutation,
	CreateProposalThumbnailUploadUrlDocument,
	type CreateProposalThumbnailUploadUrlMutation,
} from "#/graphql/generated"

function getContentType(blob: Blob) {
	return blob.type || "image/webp"
}

function assertPresignedUploadResult(
	result:
		| CreateFabricThumbnailUploadUrlMutation["createFabricThumbnailUploadUrl"]
		| CreateProposalThumbnailUploadUrlMutation["createProposalThumbnailUploadUrl"]
		| null
		| undefined,
) {
	if (!result) throw new Error("Missing thumbnail upload response")
	if (result.__typename !== "PresignedUploadResult") {
		throw new Error(result.message)
	}

	return result
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

export async function uploadFabricThumbnail(
	client: ApolloClient,
	fabricId: string,
	blob: Blob,
) {
	const response = await client.mutate({
		mutation: CreateFabricThumbnailUploadUrlDocument,
		variables: {
			input: { id: fabricId, contentType: getContentType(blob) },
		},
	})

	const upload = assertPresignedUploadResult(
		response.data?.createFabricThumbnailUploadUrl,
	)
	await uploadToPresignedUrl(upload.uploadUrl, blob)
	return upload.publicUrl
}

export async function uploadProposalThumbnail(
	client: ApolloClient,
	fabricId: string,
	blob: Blob,
) {
	const response = await client.mutate({
		mutation: CreateProposalThumbnailUploadUrlDocument,
		variables: {
			input: { fabricId, contentType: getContentType(blob) },
		},
	})

	const upload = assertPresignedUploadResult(
		response.data?.createProposalThumbnailUploadUrl,
	)
	await uploadToPresignedUrl(upload.uploadUrl, blob)
	return upload.publicUrl
}
