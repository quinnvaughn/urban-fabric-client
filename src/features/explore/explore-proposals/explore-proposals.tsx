import { useState } from "react"
import { ExploreFilterBar } from "#/features/explore/explore-filter-bar"
import { ProposalCard } from "#/features/proposal"
import { Box, Grid, LoadMore, Typography, VStack } from "#/features/ui"
import {
	ExploreProposalsDocument,
	type ExploreProposalsQuery,
	ExploreSortBy,
	type ProposalCategory,
} from "#/graphql/generated"
import type { LatLng } from "#/lib/geo"
import { useDebounce, useFocusLocation, usePaginatedQuery } from "#/lib/hooks"
import { css } from "#/styles/styled-system/css"
import { ExploreHero } from "../explore-hero"

type ExploreProposalsProps = {
	initialData: {
		items: ExploreProposalsQuery["exploreProposals"]["proposals"]
		hasMore: boolean
		total: number
	}
	ipLocation: LatLng
}

export function ExploreProposals({
	initialData,
	ipLocation,
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

	const focusLocation = useFocusLocation({ ipLocation })

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
				overflowY: "auto",
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
				onSortByChange={setSortBy}
				hasActiveFilters={selectedCategories.length > 0 || !!selectedLocation}
				onClearFilters={() => {
					setSelectedCategories([])
					setSelectedLocation(null)
				}}
				focusLat={focusLocation.lat}
				focusLng={focusLocation.lng}
			/>
			<Box className={css({ px: "7", paddingTop: "5", paddingBottom: "12" })}>
				<VStack gap="4">
					<Typography.Text size="sm" color="stone.400">
						{total} proposals
					</Typography.Text>
					<Grid cols={{ base: 1, md: 2, lg: 3, xl: 4 }} gap="4">
						{proposals.map((proposal) => (
							<ProposalCard key={proposal.id} proposal={proposal} />
						))}
					</Grid>
				</VStack>
				<LoadMore
					total={total}
					showing={proposals.length}
					hasMore={hasMore}
					loading={loading}
					onLoadMore={loadMore}
				/>
			</Box>
		</Box>
	)
}
