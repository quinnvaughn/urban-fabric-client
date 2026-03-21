import { useReadQuery } from "@apollo/client/react"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useState } from "react"
import { DashboardContainer } from "#/features/dashboard"
import { ProposalRow } from "#/features/proposal"
import {
	FilterBar,
	HStack,
	LoadMore,
	Menu,
	Segmented,
	Typography,
	VStack,
} from "#/features/ui"
import {
	MyProposalsDocument,
	ProposalCategory,
	ProposalStatusFilter,
} from "#/graphql/generated"
import { useDebounce, usePaginatedQuery } from "#/lib/hooks"
import { enumValueToReadableLabel } from "#/lib/string"

export const Route = createFileRoute("/dashboard/proposals")({
	component: RouteComponent,
	loader: ({ context }) => {
		const myPropsalsQuery = context.preloadQuery(MyProposalsDocument, {
			variables: {
				limit: 12,
				offset: 0,
			},
		})

		return { myPropsalsQuery }
	},
})

const order = [
	ProposalStatusFilter.All,
	ProposalStatusFilter.Published,
	ProposalStatusFilter.Draft,
]

function RouteComponent() {
	const { myPropsalsQuery } = Route.useLoaderData()
	const { data } = useReadQuery(myPropsalsQuery)
	const [selectedCategories, setSelectedCategories] = useState<
		ProposalCategory[]
	>([])
	const [selectedStatus, setSelectedStatus] = useState<ProposalStatusFilter>(
		ProposalStatusFilter.All,
	)
	const [search, setSearch] = useState("")
	const debouncedSearch = useDebounce(search)

	const toggleCategory = (category: ProposalCategory) => {
		setSelectedCategories((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category],
		)
	}

	if (!data || data.myProposals.__typename === "UnauthorizedError") {
		throw redirect({ to: "/login", replace: true })
	}

	const categories =
		selectedCategories.length > 0 ? selectedCategories : undefined

	const {
		items: proposals,
		hasMore,
		total,
		loading,
		loadMore,
	} = usePaginatedQuery(MyProposalsDocument, {
		initialData: {
			items: data.myProposals.proposals,
			hasMore: data.myProposals.hasMore,
			total: data.myProposals.total,
		},
		extractPayload: (d) =>
			d.myProposals.__typename === "MyProposalsPayload"
				? {
						items: d.myProposals.proposals,
						hasMore: d.myProposals.hasMore,
						total: d.myProposals.total,
					}
				: null,
		filterVars: { status: selectedStatus, categories, search: debouncedSearch },
	})

	return (
		<DashboardContainer>
			<VStack gap="5">
				<VStack gap="0.5">
					<Typography.Text
						as="h1"
						lineHeight="none"
						weight="semibold"
						size="lg"
					>
						My proposals
					</Typography.Text>
					<Typography.Text color="stone.400" size="sm">
						{total} total
					</Typography.Text>
				</VStack>
				<FilterBar>
					<FilterBar.Search
						placeholder="Search proposals..."
						value={search}
						onChange={setSearch}
					/>
					<FilterBar.Filters>
						<Segmented
							variant="pill"
							value={selectedStatus}
							onChange={(value) =>
								setSelectedStatus(value as ProposalStatusFilter)
							}
						>
							<HStack align="center" gap="2">
								<Segmented.Legend>Status</Segmented.Legend>
								<Segmented.Group>
									{Object.values(ProposalStatusFilter)
										.map((status) => (
											<Segmented.Option key={status} value={status}>
												{enumValueToReadableLabel(status)}
											</Segmented.Option>
										))
										.sort((a, b) => {
											const aValue = a.props.value as ProposalStatusFilter
											const bValue = b.props.value as ProposalStatusFilter
											return order.indexOf(aValue) - order.indexOf(bValue)
										})}
								</Segmented.Group>
							</HStack>
						</Segmented>
						<FilterBar.Separator />
						<Menu placement="bottom-end">
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
										onCheckedChange={() => toggleCategory(category)}
									>
										{enumValueToReadableLabel(category)}
									</Menu.CheckItem>
								))}
							</Menu.Content>
						</Menu>
					</FilterBar.Filters>
				</FilterBar>
				<VStack gap="2.5">
					{proposals.map((proposal) => (
						<ProposalRow
							key={proposal.id}
							id={proposal.id}
							fabricId={proposal.fabricId}
							date={proposal.updatedAt}
							title={proposal.title}
							isPublished={proposal.isPublished}
							views={proposal.viewCount}
							likes={proposal.likeCount}
							slug={proposal.slug}
							location={`${proposal.snapshotLocationCity}, ${proposal.snapshotLocationRegion}`}
							mapImage={proposal.snapshotThumbnail ?? ""}
						/>
					))}
				</VStack>
				<LoadMore
					total={total}
					showing={proposals.length}
					hasMore={hasMore}
					loading={loading}
					onLoadMore={loadMore}
					emptyLabel="No proposals"
				/>
			</VStack>
		</DashboardContainer>
	)
}
