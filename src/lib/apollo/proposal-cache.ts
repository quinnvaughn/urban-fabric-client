import type { ApolloCache, Reference } from "@apollo/client"
import {
	type ProposalRowFragment,
	ProposalRowFragmentDoc,
} from "#/graphql/generated"
import { parseLimitFromStoreFieldName } from "./fabric-cache"

/**
 * Add a newly created Proposal to every cached myProposals(...) field variant.
 * This keeps recent lists, paginated lists, and filtered lists in sync.
 */
export function addProposalToMyProposalsCache(
	cache: ApolloCache<unknown>,
	proposal: ProposalRowFragment,
) {
	const newProposalRef = cache.writeFragment({
		fragment: ProposalRowFragmentDoc,
		data: proposal,
	})

	cache.modify({
		id: "ROOT_QUERY",
		fields: {
			myProposals(existing, { readField, storeFieldName }) {
				if (!existing || existing.__typename !== "MyProposalsPayload") {
					return existing
				}

				const previous = Array.isArray(existing.proposals)
					? existing.proposals
					: []
				if (
					previous.some(
						(ref: Reference) => readField("id", ref) === proposal.id,
					)
				) {
					return existing
				}

				const limit = parseLimitFromStoreFieldName(storeFieldName)
				const withNew = [newProposalRef, ...previous]
				const next =
					typeof limit === "number" ? withNew.slice(0, limit) : withNew

				return {
					...existing,
					proposals: next,
					total: (existing.total ?? 0) + 1,
				}
			},
		},
	})
}

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
