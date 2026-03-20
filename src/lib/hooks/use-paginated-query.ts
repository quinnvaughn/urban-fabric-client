import type { TypedDocumentNode } from "@apollo/client"
import { useLazyQuery } from "@apollo/client/react"
import { useCallback, useEffect, useRef, useState } from "react"

interface PaginatedPayload<TItem> {
	items: TItem[]
	hasMore: boolean
	total: number
}

interface UsePaginatedQueryOptions<TData, TItem, TFilterVars> {
	initialData: PaginatedPayload<TItem>
	extractPayload: (data: TData) => PaginatedPayload<TItem> | null | undefined
	filterVars: TFilterVars
	limit?: number
}

export function usePaginatedQuery<
	TData,
	TItem,
	TFilterVars extends Record<string, unknown>,
>(
	document: TypedDocumentNode<
		TData,
		TFilterVars & { limit: number; offset: number }
	>,
	{
		initialData,
		extractPayload,
		filterVars,
		limit = 12,
	}: UsePaginatedQueryOptions<TData, TItem, TFilterVars>,
) {
	const [items, setItems] = useState(initialData.items)
	const [hasMore, setHasMore] = useState(initialData.hasMore)
	const [total, setTotal] = useState(initialData.total)
	const [offset, setOffset] = useState(initialData.items.length)
	const isFilterChange = useRef(false)
	const initialFilterVarsJson = useRef(JSON.stringify(filterVars))
	const hasFilterChangedFromInitial = useRef(false)
	const isFetchPending = useRef(false)
	const extractPayloadRef = useRef(extractPayload)
	extractPayloadRef.current = extractPayload

	const [fetch, { loading, data }] = useLazyQuery(document)

	// Re-fetch and replace when filters change.
	// Skips when filterVars haven't changed from the initial value so that
	// React Strict Mode's double-invoke of effects doesn't trigger a spurious
	// fetch (which would cause a visible reorder/"flip" of the cards).
	// biome-ignore lint/correctness/useExhaustiveDependencies: JSON.stringify used for deep object comparison
	useEffect(() => {
		const currentJson = JSON.stringify(filterVars)
		if (
			!hasFilterChangedFromInitial.current &&
			currentJson === initialFilterVarsJson.current
		) {
			return
		}
		hasFilterChangedFromInitial.current = true
		isFilterChange.current = true
		isFetchPending.current = true
		fetch({ variables: { ...filterVars, limit, offset: 0 } })
	}, [JSON.stringify(filterVars), fetch, limit])

	// Apply fetched data — replace on filter change, append on load more
	// Only process when we explicitly triggered a fetch, not on cache-update re-renders
	useEffect(() => {
		if (!isFetchPending.current) return
		const payload = data ? extractPayloadRef.current(data) : null
		if (!payload) return
		isFetchPending.current = false
		if (isFilterChange.current) {
			setItems(payload.items)
			setOffset(payload.items.length)
			isFilterChange.current = false
		} else {
			setItems((prev) => [...prev, ...payload.items])
			setOffset((prev) => prev + payload.items.length)
		}
		setHasMore(payload.hasMore)
		setTotal(payload.total)
	}, [data])

	// biome-ignore lint/correctness/useExhaustiveDependencies: JSON.stringify used for deep object comparison
	const loadMore = useCallback(() => {
		isFetchPending.current = true
		fetch({ variables: { ...filterVars, limit, offset } })
	}, [fetch, limit, offset, JSON.stringify(filterVars)])

	return { items, hasMore, total, loading, loadMore }
}
