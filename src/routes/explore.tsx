import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { ExploreProposals } from "#/features/explore"
import { Navbar } from "#/features/navigation"
import { ExploreProposalsDocument, ExploreSortBy } from "#/graphql/generated"
import { useAnalytics } from "#/lib/analytics"
import { getLocationFromIp } from "#/lib/geo"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/explore")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const exploreProposalsQuery = context.preloadQuery(
			ExploreProposalsDocument,
			{
				variables: { sortBy: ExploreSortBy.Hottest, limit: 12, offset: 0 },
			},
		)
		const ipLocation = await getLocationFromIp()
		return { exploreProposalsQuery, ipLocation }
	},
})

function RouteComponent() {
	const { exploreProposalsQuery, ipLocation } = Route.useLoaderData()
	const { data } = useReadQuery(exploreProposalsQuery)
	const { capture } = useAnalytics()

	useEffect(() => {
		capture("page_viewed", { page: "explore" })
	}, [capture])

	return (
		<>
			<Navbar />
			<main
				className={css({
					w: "100%",
					minHeight: "calc(100dvh - var(--uf-header-height, 56px))",
					background: "stone.100",
					position: "relative",
				})}
			>
				<ExploreProposals
					initialData={{
						items: data.exploreProposals.proposals,
						hasMore: data.exploreProposals.hasMore,
						total: data.exploreProposals.total,
					}}
					ipLocation={ipLocation}
					usePageScroll
				/>
			</main>
		</>
	)
}
