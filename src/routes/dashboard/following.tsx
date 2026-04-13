import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { FollowingHero, FollowingList } from "#/features/following"
import { Box } from "#/features/ui"
import { FollowingProposalsDocument } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/dashboard/following")({
	component: RouteComponent,
	loader: ({ context: { preloadQuery } }) => {
		const followingProposalsQuery = preloadQuery(FollowingProposalsDocument, {
			variables: { limit: 12, offset: 0 },
		})

		return { followingProposalsQuery }
	},
})

function RouteComponent() {
	const { followingProposalsQuery } = Route.useLoaderData()
	const { data } = useReadQuery(followingProposalsQuery)
	return (
		<Box
			className={css({
				display: "flex",
				flexDir: "column",
				flex: 1,
			})}
		>
			<FollowingHero />
			<FollowingList
				initialData={{
					items: data.followingProposals.proposals,
					hasMore: data.followingProposals.hasMore,
					total: data.followingProposals.total,
				}}
			/>
		</Box>
	)
}
