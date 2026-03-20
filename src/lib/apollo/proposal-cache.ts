import type { ApolloCache, Reference } from "@apollo/client"

/**
 * Remove a Proposal from every cached myProposals(...) field variant.
 * This keeps recent lists, paginated lists, and filtered lists in sync.
 */
export function removeProposalFromMyProposalsCache(
	cache: ApolloCache<unknown>,
	deletedProposalId: string,
) {
	cache.modify({
		id: "ROOT_QUERY",
		fields: {
			myProposals(existing, { readField }) {
				if (!existing || existing.__typename !== "MyProposalsPayload") {
					return existing
				}

				const previous = Array.isArray(existing.proposals)
					? existing.proposals
					: []
				const next = previous.filter((proposalRef: Reference) => {
					return readField("id", proposalRef) !== deletedProposalId
				})

				if (next.length === previous.length) return existing

				return {
					...existing,
					proposals: next,
					total: Math.max(0, (existing.total ?? 0) - 1),
				}
			},
		},
	})
}
