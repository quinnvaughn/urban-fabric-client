import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { DashboardContainer, EmptySection } from "#/features/dashboard"
import { FabricCard } from "#/features/fabric"
import { FilterBar, Grid, LoadMore, Typography, VStack } from "#/features/ui"
import type { MyFabricsQuery } from "#/graphql/generated"
import { MyFabricsDocument } from "#/graphql/generated"
import { useAnalytics } from "#/lib/analytics"
import { useDebounce, usePaginatedQuery } from "#/lib/hooks"

export const Route = createFileRoute("/dashboard/fabrics")({
	component: RouteComponent,
	loader: ({ context }) => {
		const myFabricsQuery = context.preloadQuery(MyFabricsDocument, {
			variables: {
				limit: 12,
				offset: 0,
			},
		})
		return { myFabricsQuery }
	},
})

type MyFabricsPayload = Extract<
	MyFabricsQuery["myFabrics"],
	{ __typename: "MyFabricsPayload" }
>

function RouteComponent() {
	const { myFabricsQuery } = Route.useLoaderData()
	const { data } = useReadQuery(myFabricsQuery)
	const { capture } = useAnalytics()

	useEffect(() => {
		capture("page_viewed", { page: "my_fabrics" })
	}, [capture])

	if (!data || data.myFabrics.__typename === "UnauthorizedError") {
		return null
	}
	return <FabricsContent myFabrics={data.myFabrics} />
}

function FabricsContent({ myFabrics }: { myFabrics: MyFabricsPayload }) {
	const [search, setSearch] = useState("")
	const debouncedSearch = useDebounce(search)

	const {
		items: fabrics,
		hasMore,
		total,
		loading,
		loadMore,
	} = usePaginatedQuery(MyFabricsDocument, {
		initialData: {
			items: myFabrics.fabrics,
			hasMore: myFabrics.hasMore,
			total: myFabrics.total,
		},
		extractPayload: (d) =>
			d.myFabrics.__typename === "MyFabricsPayload"
				? {
						items: d.myFabrics.fabrics,
						hasMore: d.myFabrics.hasMore,
						total: d.myFabrics.total,
					}
				: null,
		filterVars: { search: debouncedSearch },
	})

	const hasCreatedFabrics = myFabrics.fabrics.length > 0

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
						My fabrics
					</Typography.Text>
					<Typography.Text color="stone.400" size="sm">
						{total} total
					</Typography.Text>
				</VStack>
				<VStack gap="4">
					<FilterBar>
						<FilterBar.Search
							placeholder="Search fabrics..."
							value={search}
							onChange={setSearch}
						/>
					</FilterBar>
					{hasCreatedFabrics ? (
						<Grid gap="3" cols={{ base: "1", md: "2", lg: "3" }}>
							{fabrics.map((fabric) => (
								<FabricCard fabric={fabric} key={fabric.id} />
							))}
						</Grid>
					) : (
						<EmptySection type="fabric" />
					)}
				</VStack>
				<LoadMore
					total={total}
					showing={fabrics.length}
					hasMore={hasMore}
					loading={loading}
					onLoadMore={loadMore}
				/>
			</VStack>
		</DashboardContainer>
	)
}
