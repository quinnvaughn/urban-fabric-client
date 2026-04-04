import { useMutation } from "@apollo/client/react"
import { useToast } from "#/features/ui"
import { UpdateProposalCommentDocument } from "#/graphql/generated"

export function useUpdateProposalComment() {
	const { toast } = useToast()
	const [updateProposalComment] = useMutation(UpdateProposalCommentDocument)

	return async function saveComment(id: string, body: string) {
		try {
			const { data } = await updateProposalComment({
				variables: {
					input: {
						id,
						body,
					},
				},
			})

			const result = data?.updateProposalComment
			if (!result) {
				toast({ title: "Unable to update comment", intent: "error" })
				return false
			}

			if (result.__typename !== "ProposalComment") {
				toast({ title: result.message, intent: "error" })
				return false
			}

			return true
		} catch {
			toast({ title: "Unable to update comment", intent: "error" })
			return false
		}
	}
}
