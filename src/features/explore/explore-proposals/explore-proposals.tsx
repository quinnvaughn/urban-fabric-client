import { useEffect, useRef, useState } from "react"
import { match } from "ts-pattern"
import { ExploreFilterBar } from "#/features/explore/explore-filter-bar"
import { ProposalCard, ProposalSearchEmptyState } from "#/features/proposal"
import { Box, Grid, LoadMore, Typography, VStack } from "#/features/ui"
import {
	ExploreProposalsDocument,
	type ExploreProposalsQuery,
	ExploreSortBy,
	type ProposalCategory,
} from "#/graphql/generated"
import { useAnalytics } from "#/lib/analytics"
import type { LatLng } from "#/lib/geo"
import { useDebounce, usePaginatedQuery } from "#/lib/hooks"
import { css } from "#/styles/styled-system/css"
import { ExploreHero } from "../explore-hero"

type ExploreProposalsProps = {
	initialData: {
		items: ExploreProposalsQuery["exploreProposals"]["proposals"]
		hasMore: boolean
		total: number
	}
	ipLocation: LatLng
	usePageScroll?: boolean
}

export function ExploreProposals({
	initialData,
	ipLocation,
	usePageScroll = false,
}: ExploreProposalsProps) {
	const [search, setSearch] = useState("")
	const debouncedSearch = useDebounce(search)
	const [selectedCategories, setSelectedCategories] = useState<
		ProposalCategory[]
	>([])
	const [sortBy, setSortBy] = useState(ExploreSortBy.MostLiked)
	const [selectedLocation, setSelectedLocation] = useState<{
		lat: number
		lng: number
		label: string
	} | null>(null)
	const { capture } = useAnalytics()
	const searchFiredRef = useRef(false)

	useEffect(() => {
		if (!searchFiredRef.current && debouncedSearch.length === 0) return
		searchFiredRef.current = true
		if (debouncedSearch.length > 0) {
			capture("explore_searched", {
				has_location: !!selectedLocation,
				query_length: debouncedSearch.length,
				category_count: selectedCategories.length,
			})
		}
	}, [debouncedSearch, capture, selectedLocation, selectedCategories.length])

	const toggleCategory = (category: ProposalCategory) => {
		setSelectedCategories((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category],
		)
	}

	const {
		items: proposals,
		hasMore,
		total,
		loading,
		loadMore,
	} = usePaginatedQuery(ExploreProposalsDocument, {
		initialData,
		extractPayload: (d) =>
			d.exploreProposals.__typename === "ExploreProposalsPayload"
				? {
						items: d.exploreProposals.proposals,
						hasMore: d.exploreProposals.hasMore,
						total: d.exploreProposals.total,
					}
				: null,
		filterVars: {
			categories: selectedCategories,
			nearLat: selectedLocation?.lat,
			nearLng: selectedLocation?.lng,
			radiusMiles: selectedLocation ? 50 : undefined,
			search: debouncedSearch,
			sortBy,
		},
	})

	return (
		<Box
			className={css({
				display: "flex",
				flexDir: "column",
				flex: 1,
				overflowY: usePageScroll ? undefined : "auto",
			})}
		>
			<ExploreHero />
			<ExploreFilterBar
				search={search}
				onSearchChange={setSearch}
				selectedCategories={selectedCategories}
				onToggleCategory={toggleCategory}
				selectedLocation={selectedLocation}
				onLocationChange={setSelectedLocation}
				sortBy={sortBy}
				onSortByChange={(value) => {
					capture("explore_sorted", { sort_by: value })
					setSortBy(value)
				}}
				hasActiveFilters={selectedCategories.length > 0 || !!selectedLocation}
				onClearFilters={() => {
					setSelectedCategories([])
					setSelectedLocation(null)
				}}
				focusLat={ipLocation.lat}
				focusLng={ipLocation.lng}
			/>
			<Box className={css({ px: "7", paddingTop: "5", paddingBottom: "12" })}>
				<VStack gap="4">
					<Typography.Text size="sm" color="stone.400">
						{total} proposals
					</Typography.Text>
					{match(proposals)
						.when(
							(p) => p.length === 0,
							() => <ProposalSearchEmptyState />,
						)
						.otherwise((p) => (
							<Grid cols={{ base: 1, md: 2, lg: 3, xl: 4 }} gap="4">
								{p.map((proposal) => (
									<ProposalCard key={proposal.id} proposal={proposal} />
								))}
							</Grid>
						))}
				</VStack>
				<LoadMore
					total={total}
					showing={proposals.length}
					hasMore={hasMore}
					loading={loading}
					onLoadMore={loadMore}
					hideEmpty
				/>
			</Box>
		</Box>
	)
}
