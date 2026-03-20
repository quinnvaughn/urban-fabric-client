import {
	Box,
	Button,
	FilterBar,
	HStack,
	Menu,
	Segmented,
} from "#/features/ui"
import { ExploreSortBy, ProposalCategory } from "#/graphql/generated"
import { useSticky } from "#/lib/hooks/use-sticky"
import { enumValueToReadableLabel } from "#/lib/string"
import { css } from "#/styles/styled-system/css"
import { LocationFilter, type SelectedLocation } from "../location-filter"

type ExploreFilterBarProps = {
	search: string
	onSearchChange: (value: string) => void
	selectedCategories: ProposalCategory[]
	onToggleCategory: (category: ProposalCategory) => void
	selectedLocation: SelectedLocation | null
	onLocationChange: (location: SelectedLocation | null) => void
	sortBy: ExploreSortBy
	onSortByChange: (value: ExploreSortBy) => void
	hasActiveFilters: boolean
	onClearFilters: () => void
	focusLat: number
	focusLng: number
}

export function ExploreFilterBar({
	search,
	onSearchChange,
	selectedCategories,
	onToggleCategory,
	selectedLocation,
	onLocationChange,
	sortBy,
	onSortByChange,
	hasActiveFilters,
	onClearFilters,
	focusLat,
	focusLng,
}: ExploreFilterBarProps) {
	const { sentinelRef, isStuck } = useSticky()

	return (
		<>
			<div ref={sentinelRef} />
			<Box
				className={css({
					position: "sticky",
					top: 0,
					zIndex: "raised",
					py: "4",
					px: "7",
					boxShadow: isStuck ? "sm" : undefined,
					background: "stone.100",
					flexShrink: 0,
				})}
			>
				<FilterBar>
					<FilterBar.Search
						placeholder="Search proposals"
						value={search}
						onChange={onSearchChange}
					/>
					<FilterBar.Filters>
						<HStack gap="8" justify="between" className={css({ w: "full" })}>
							<HStack
								gap="2"
								align="center"
								className={css({ whiteSpace: "nowrap" })}
							>
								<Menu placement="bottom-start">
									<Menu.Trigger>
										<Menu.FilterTrigger active={selectedCategories.length > 0}>
											{selectedCategories.length > 0
												? `Category · ${selectedCategories.length}`
												: "Category"}
										</Menu.FilterTrigger>
									</Menu.Trigger>
									<Menu.Content>
										{Object.values(ProposalCategory).map((category) => (
											<Menu.CheckItem
												key={category}
												checked={selectedCategories.includes(category)}
												onCheckedChange={() => onToggleCategory(category)}
											>
												{enumValueToReadableLabel(category)}
											</Menu.CheckItem>
										))}
									</Menu.Content>
								</Menu>
								<FilterBar.Separator />
								<LocationFilter
									focusLat={focusLat}
									focusLng={focusLng}
									value={selectedLocation}
									onChange={onLocationChange}
								/>
								{hasActiveFilters && (
									<Button
										type="button"
										appearance="ghost"
										intent="neutral"
										size="sm"
										onClick={onClearFilters}
									>
										Clear filters
									</Button>
								)}
							</HStack>
							<Segmented
								variant="pill"
								value={sortBy}
								onChange={(value) => onSortByChange(value as ExploreSortBy)}
							>
								<HStack
									gap="2"
									align="center"
									className={css({ whiteSpace: "nowrap" })}
								>
									<Segmented.Legend>Sort By</Segmented.Legend>
									<Segmented.Group>
										<Segmented.Option value={ExploreSortBy.MostLiked}>
											Most liked
										</Segmented.Option>
										<Segmented.Option value={ExploreSortBy.MostViewed}>
											Most viewed
										</Segmented.Option>
										<Segmented.Option value={ExploreSortBy.Recent}>
											Newest
										</Segmented.Option>
									</Segmented.Group>
								</HStack>
							</Segmented>
						</HStack>
					</FilterBar.Filters>
				</FilterBar>
			</Box>
		</>
	)
}
