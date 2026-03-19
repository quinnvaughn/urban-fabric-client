import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { MapPin, Search } from "lucide-react"
import { useState } from "react"
import { ExploreHero } from "#/features/explore"
import { ProposalCard } from "#/features/proposal"
import {
	Box,
	FilterBar,
	Grid,
	HStack,
	Input,
	Menu,
	Segmented,
} from "#/features/ui"
import {
	ExploreProposalsDocument,
	ExploreSortBy,
	ProposalCategory,
} from "#/graphql/generated"
import { useDebounce, usePaginatedQuery } from "#/lib/hooks"
import { useSticky } from "#/lib/hooks/use-sticky"
import { enumValueToReadableLabel } from "#/lib/string"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/dashboard/explore")({
	component: RouteComponent,
	loader: ({ context }) => {
		const exploreProposalsQuery = context.preloadQuery(ExploreProposalsDocument)
		return { exploreProposalsQuery }
	},
})

function RouteComponent() {
	const { exploreProposalsQuery } = Route.useLoaderData()
	const { data } = useReadQuery(exploreProposalsQuery)
	const { sentinelRef, isStuck } = useSticky()
	const [search, setSearch] = useState("")
	const debouncedSearch = useDebounce(search)
	const [selectedCategories, setSelectedCategories] = useState<
		ProposalCategory[]
	>([])

	const toggleCategory = (category: ProposalCategory) => {
		setSelectedCategories((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category],
		)
	}

	const [sortBy, setSortBy] = useState(ExploreSortBy.MostLiked)

	const {
		items: proposals,
		hasMore,
		total,
		loading,
		loadMore,
	} = usePaginatedQuery(ExploreProposalsDocument, {
		initialData: {
			items: data.exploreProposals.proposals,
			hasMore: data.exploreProposals.hasMore,
			total: data.exploreProposals.total,
		},
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
						onChange={setSearch}
					/>
					<FilterBar.Filters>
						<HStack gap="0" justify="between" className={css({ w: "full" })}>
							<HStack gap="3">
								<Menu placement="bottom-start">
									<Menu.Trigger>
										<Menu.FilterTrigger>Categories</Menu.FilterTrigger>
									</Menu.Trigger>
									<Menu.Content>
										{Object.values(ProposalCategory).map((category) => (
											<Menu.CheckItem
												key={category}
												checked={selectedCategories.includes(category)}
												onCheckedChange={() => toggleCategory(category)}
											>
												{enumValueToReadableLabel(category)}
											</Menu.CheckItem>
										))}
									</Menu.Content>
								</Menu>
								<FilterBar.Separator />
								<Menu placement="bottom-start">
									<Menu.Trigger>
										<Menu.FilterTrigger>
											<HStack gap="1" align="center">
												<MapPin size={12} />
												<span>Location</span>
											</HStack>
										</Menu.FilterTrigger>
									</Menu.Trigger>
									<Menu.Content size="lg">
										<Input size="sm">
											<Input.Field
												startAdornment={<Search size={12} />}
												placeholder="Search cities"
											/>
										</Input>
									</Menu.Content>
								</Menu>
							</HStack>
							<Segmented
								variant="pill"
								value={sortBy}
								onChange={(value) => setSortBy(value as ExploreSortBy)}
							>
								<HStack gap="2" align="center">
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
			<Grid
				cols={{ base: 1, md: 2, lg: 3, xl: 4 }}
				gap="4"
				className={css({ px: "7" })}
			>
				{proposals.map((proposal) => (
					<ProposalCard key={proposal.id} proposal={proposal} />
				))}
			</Grid>
		</Box>
	)
}
