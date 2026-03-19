import { useReadQuery } from "@apollo/client/react"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useState } from "react"
import { DashboardContainer } from "#/features/dashboard"
import { FabricCard } from "#/features/fabric"
import { Button, FilterBar, Grid, Typography, VStack } from "#/features/ui"
import { MyFabricsDocument } from "#/graphql/generated"
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

function RouteComponent() {
	const { myFabricsQuery } = Route.useLoaderData()
	const { data } = useReadQuery(myFabricsQuery)
	if (!data || data.myFabrics.__typename === "UnauthorizedError") {
		throw redirect({ to: "/login", replace: true })
	}

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
			items: data.myFabrics.fabrics,
			hasMore: data.myFabrics.hasMore,
			total: data.myFabrics.total,
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

	return (
		<DashboardContainer>
			<VStack gap="5">
				<VStack gap="0.5">
					<Typography.Text as="h1" lineHeight="none" weight="semibold" size="lg">
						My fabrics
					</Typography.Text>
					<Typography.Text color="stone.400" size="sm">
						{total} total
					</Typography.Text>
				</VStack>
				<VStack gap="10">
					<VStack gap="4">
						<FilterBar>
							<FilterBar.Search
								placeholder="Search fabrics..."
								value={search}
								onChange={setSearch}
							/>
						</FilterBar>
						<Grid gap="3" cols={{ base: "1", md: "2", lg: "3" }}>
							{fabrics.map((fabric) => (
								<FabricCard
									hasProposal={fabric.hasProposal}
									id={fabric.id}
									key={fabric.id}
									lastEdited={fabric.updatedAt}
									location={`${fabric.locationCity}, ${fabric.locationRegion}`}
									mapImage={fabric.thumbnail ?? ""}
									title={fabric.title}
								/>
							))}
						</Grid>
					</VStack>
					<VStack id="load-more" align="center" gap="4">
						<Typography.Text color="stone.400" size="sm">
							{hasMore
								? `Showing ${fabrics.length} of ${total}`
								: `Showing all ${total}`}
						</Typography.Text>
						{hasMore && (
							<Button
								appearance="outline"
								intent="neutral"
								loading={loading}
								disabled={loading}
								onClick={() => loadMore()}
							>
								Load more
							</Button>
						)}
					</VStack>
				</VStack>
			</VStack>
		</DashboardContainer>
	)
}
