import { useLazyQuery, useReadQuery } from "@apollo/client/react"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { FabricCard } from "#/features/fabric"
import { Button, Grid, Typography, VStack } from "#/features/ui"
import { MyFabricsDocument } from "#/graphql/generated"

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
	const initial = data.myFabrics
	const [fabrics, setFabrics] = useState(initial.fabrics)
	const [hasMore, setHasMore] = useState(initial.hasMore)
	const [total, setTotal] = useState(initial.total)
	const [offset, setOffset] = useState(initial.fabrics.length)
	const [loadMoreFabrics, { loading, data: moreData }] =
		useLazyQuery(MyFabricsDocument)
	useEffect(() => {
		if (moreData?.myFabrics.__typename === "MyFabricsPayload") {
			const {
				fabrics: newFabrics,
				hasMore: newHasMore,
				total: newTotal,
			} = moreData.myFabrics
			setFabrics((prev) => [...prev, ...newFabrics])
			setHasMore(newHasMore)
			setTotal(newTotal)
			setOffset((prev) => prev + newFabrics.length)
		}
	}, [moreData])
	return (
		<VStack gap="5">
			<VStack gap="0.5">
				<Typography.Text as="h1" leading="none" weight="semibold">
					My fabrics
				</Typography.Text>
				<Typography.Text color="stone.400" size="sm">
					{total} total
				</Typography.Text>
			</VStack>
			<VStack gap="10">
				<Grid gap="3" cols={3}>
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
							onClick={() =>
								loadMoreFabrics({ variables: { limit: 3, offset } })
							}
						>
							Load more
						</Button>
					)}
				</VStack>
			</VStack>
		</VStack>
	)
}
