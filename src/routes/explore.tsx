import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { ExploreProposals } from "#/features/explore"
import { Navbar } from "#/features/navigation"
import { ExploreProposalsDocument } from "#/graphql/generated"
import { getLocationFromIp } from "#/lib/geo"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/explore")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const exploreProposalsQuery = context.preloadQuery(ExploreProposalsDocument)
		const ipLocation = await getLocationFromIp()
		return { exploreProposalsQuery, ipLocation }
	},
})

function RouteComponent() {
	const { exploreProposalsQuery, ipLocation } = Route.useLoaderData()
	const { data } = useReadQuery(exploreProposalsQuery)

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
