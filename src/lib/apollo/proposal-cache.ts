import type { ApolloCache, Reference } from "@apollo/client"
import {
	type ProposalFormResultFragment,
	ProposalFormResultFragmentDoc,
} from "#/graphql/generated"
import { parseLimitFromStoreFieldName } from "./fabric-cache"

/**
 * Add a newly created Proposal to every cached myProposals(...) field variant.
 * This keeps recent lists, paginated lists, and filtered lists in sync.
 */
export function addProposalToMyProposalsCache(
	cache: ApolloCache,
	proposal: ProposalFormResultFragment,
) {
	const newProposalRef = cache.writeFragment({
		fragment: ProposalFormResultFragmentDoc,
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

export function adjustMyDashboardStatsCache(
	cache: ApolloCache,
	changes: { proposalDelta?: number; unpublishedProposalDelta?: number },
) {
	const proposalDelta = changes.proposalDelta ?? 0
	const unpublishedProposalDelta = changes.unpublishedProposalDelta ?? 0
	if (proposalDelta === 0 && unpublishedProposalDelta === 0) return

	cache.modify({
		id: "ROOT_QUERY",
		fields: {
			myDashboardStats(existing) {
				if (!existing || existing.__typename !== "DashboardStats") {
					return existing
				}

				return {
					...existing,
					proposalCount: Math.max(
						0,
						(existing.proposalCount ?? 0) + proposalDelta,
					),
					unpublishedProposalCount: Math.max(
						0,
						(existing.unpublishedProposalCount ?? 0) + unpublishedProposalDelta,
					),
				}
			},
		},
	})
}

export function adjustMyDashboardEngagementCache(
	cache: ApolloCache,
	changes: { likesDelta?: number; viewsDelta?: number },
) {
	const likesDelta = changes.likesDelta ?? 0
	const viewsDelta = changes.viewsDelta ?? 0
	if (likesDelta === 0 && viewsDelta === 0) return

	cache.modify({
		id: "ROOT_QUERY",
		fields: {
			myDashboardStats(existing) {
				if (!existing || existing.__typename !== "DashboardStats") {
					return existing
				}

				return {
					...existing,
					totalProposalLikes: Math.max(
						0,
						(existing.totalProposalLikes ?? 0) + likesDelta,
					),
					totalProposalViews: Math.max(
						0,
						(existing.totalProposalViews ?? 0) + viewsDelta,
					),
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
	cache: ApolloCache,
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
