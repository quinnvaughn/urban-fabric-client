import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { ExploreProposals } from "#/features/explore"
import { ExploreProposalsDocument, ExploreSortBy } from "#/graphql/generated"
import { getLocationFromIp } from "#/lib/geo"

export const Route = createFileRoute("/dashboard/explore")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const exploreProposalsQuery = context.preloadQuery(
			ExploreProposalsDocument,
			{
				variables: { sortBy: ExploreSortBy.MostLiked, limit: 12, offset: 0 },
			},
		)
		const ipLocation = await getLocationFromIp()
		return { exploreProposalsQuery, ipLocation }
	},
})

function RouteComponent() {
	const { exploreProposalsQuery, ipLocation } = Route.useLoaderData()
	const { data } = useReadQuery(exploreProposalsQuery)

	return (
		<ExploreProposals
			initialData={{
				items: data.exploreProposals.proposals,
				hasMore: data.exploreProposals.hasMore,
				total: data.exploreProposals.total,
			}}
			ipLocation={ipLocation}
		/>
	)
}
