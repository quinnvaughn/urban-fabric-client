import { useMutation } from "@apollo/client/react"
import { useToast } from "#/features/ui"
import {
	DeleteProposalCommentDocument,
	GetProposalDocument,
} from "#/graphql/generated"

type DeleteCommentInput = {
	id: string
	parentId?: string
	proposalSlug?: string
}

export function useDeleteProposalComment() {
	const { toast } = useToast()
	const [deletePC] = useMutation(DeleteProposalCommentDocument)

	return async function deleteComment({
		id,
		parentId,
		proposalSlug,
	}: DeleteCommentInput) {
		try {
			const { data } = await deletePC({
				variables: {
					input: {
						id,
					},
				},
				update: (cache, { data }) => {
					const result = data?.deleteProposalComment
					if (result?.__typename !== "ProposalComment") return
					const shouldRemoveFromArray = result.replyCount === 0

					if (parentId) {
						cache.modify({
							id: cache.identify({
								__typename: "ProposalComment",
								id: parentId,
							}),
							fields: {
								replyCount: (count: number) => Math.max(count - 1, 0),
							},
						})
					}

					if (proposalSlug) {
						cache.updateQuery(
							{
								query: GetProposalDocument,
								variables: { slug: proposalSlug },
							},
							(existing) => {
								if (
									!existing ||
									existing.proposalBySlug.__typename !== "Proposal"
								) {
									return existing
								}

								return {
									...existing,
									proposalBySlug: {
										...existing.proposalBySlug,
										commentCount: Math.max(
											existing.proposalBySlug.commentCount - 1,
											0,
										),
									},
								}
							},
						)
					}

					if (shouldRemoveFromArray) {
						cache.evict({
							id: cache.identify({
								__typename: "ProposalComment",
								id: result.id,
							}),
						})
						cache.gc()
					}
				},
			})

			const result = data?.deleteProposalComment
			if (!result) {
				toast({ title: "Unable to delete comment", intent: "error" })
				return false
			}

			if (result.__typename !== "ProposalComment") {
				toast({ title: result.message, intent: "error" })
				return false
			}

			return true
		} catch {
			toast({ title: "Unable to delete comment", intent: "error" })
			return false
		}
	}
}
