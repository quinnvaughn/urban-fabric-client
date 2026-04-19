import { type ApolloCache, gql, type Reference } from "@apollo/client"
import {
	type FabricCardFragment,
	FabricCardFragmentDoc,
} from "#/graphql/generated"

export function parseLimitFromStoreFieldName(
	storeFieldName: string,
): number | null {
	const argsStart = storeFieldName.indexOf("(")
	if (argsStart < 0) return null

	const rawArgs = storeFieldName.slice(argsStart + 1, -1)
	if (!rawArgs) return null

	try {
		const args = JSON.parse(rawArgs) as { limit?: number }
		return typeof args.limit === "number" ? args.limit : null
	} catch {
		return null
	}
}

/**
 * Add a newly created Fabric to every cached myFabrics(...) field variant.
 * This keeps recent lists, paginated lists, and searched lists in sync.
 */
export function addFabricToMyFabricsCache(
	cache: ApolloCache,
	fabric: FabricCardFragment,
) {
	const newFabricRef = cache.writeFragment({
		fragment: FabricCardFragmentDoc,
		data: fabric,
	})

	cache.modify({
		id: "ROOT_QUERY",
		fields: {
			myFabrics(existing, { readField, storeFieldName }) {
				if (!existing || existing.__typename !== "MyFabricsPayload") {
					return existing
				}

				const previous = Array.isArray(existing.fabrics) ? existing.fabrics : []
				if (
					previous.some(
						(fabricRef: Reference) => readField("id", fabricRef) === fabric.id,
					)
				) {
					return existing
				}

				const limit = parseLimitFromStoreFieldName(storeFieldName)
				const withNew = [newFabricRef, ...previous]
				const next =
					typeof limit === "number" ? withNew.slice(0, limit) : withNew

				return {
					...existing,
					fabrics: next,
					total: (existing.total ?? 0) + 1,
					hasMore:
						typeof existing.hasMore === "boolean"
							? existing.hasMore || next.length < (existing.total ?? 0) + 1
							: existing.hasMore,
				}
			},
		},
	})
}

/**
 * Remove a Fabric from every cached myFabrics(...) field variant.
 * This keeps recent lists, paginated lists, and searched lists in sync.
 */
export function removeFabricFromMyFabricsCache(
	cache: ApolloCache,
	deletedFabricId: string,
) {
	cache.modify({
		id: "ROOT_QUERY",
		fields: {
			myFabrics(existing, { readField }) {
				if (!existing || existing.__typename !== "MyFabricsPayload") {
					return existing
				}

				const previous = Array.isArray(existing.fabrics) ? existing.fabrics : []
				const next = previous.filter((fabricRef: Reference) => {
					return readField("id", fabricRef) !== deletedFabricId
				})

				if (next.length === previous.length) return existing

				return {
					...existing,
					fabrics: next,
					total: Math.max(0, (existing.total ?? 0) - 1),
				}
			},
		},
	})
}

export function adjustMyDashboardFabricCountCache(
	cache: ApolloCache,
	fabricDelta: number,
) {
	if (fabricDelta === 0) return

	cache.modify({
		id: "ROOT_QUERY",
		fields: {
			myDashboardStats(
				existing:
					| Reference
					| { __typename?: string; fabricCount?: number }
					| undefined,
			) {
				if (existing && "__ref" in existing) return existing
				if (!existing || existing.__typename !== "DashboardStats") {
					return existing
				}

				return {
					...existing,
					fabricCount: Math.max(0, (existing.fabricCount ?? 0) + fabricDelta),
				}
			},
		},
	})
}

export function evictFabricListCaches(cache: ApolloCache) {
	cache.evict({ fieldName: "myFabrics" })
	cache.gc()
}

/**
 * Null out the proposal field on a cached Fabric so that the fabric
 * appears as having no proposal after its proposal is deleted.
 */
export function clearFabricProposalFromCache(
	cache: ApolloCache,
	fabricId: string,
) {
	cache.modify({
		id: cache.identify({ __typename: "Fabric", id: fabricId }),
		fields: {
			proposal: () => null,
		},
	})
}

/**
 * Write the newly created proposal onto the cached Fabric so that
 * hasProposal-dependent UI (e.g. the Publish button) updates immediately.
 */
export function setFabricProposalInCache(
	cache: ApolloCache,
	fabricId: string,
	proposal: { id: string; isPublished: boolean },
) {
	const proposalRef = cache.writeFragment({
		fragment: gql`
			fragment NewProposal on Proposal {
				id
				isPublished
			}
		`,
		data: { __typename: "Proposal", ...proposal },
	})
	cache.modify({
		id: cache.identify({ __typename: "Fabric", id: fabricId }),
		fields: {
			proposal: () => proposalRef,
		},
	})
}
