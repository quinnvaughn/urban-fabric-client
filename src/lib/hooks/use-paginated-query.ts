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
	const isFirstRender = useRef(true)
	const extractPayloadRef = useRef(extractPayload)
	extractPayloadRef.current = extractPayload

	const [fetch, { loading, data }] = useLazyQuery(document)

	// Re-fetch and replace when filters change
	// biome-ignore lint/correctness/useExhaustiveDependencies: JSON.stringify used for deep object comparison
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false
			return
		}
		isFilterChange.current = true
		fetch({ variables: { ...filterVars, limit, offset: 0 } })
	}, [JSON.stringify(filterVars), fetch, limit])

	// Apply fetched data — replace on filter change, append on load more
	useEffect(() => {
		const payload = data ? extractPayloadRef.current(data) : null
		if (!payload) return
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
		fetch({ variables: { ...filterVars, limit, offset } })
	}, [fetch, limit, offset, JSON.stringify(filterVars)])

	return { items, hasMore, total, loading, loadMore }
}
