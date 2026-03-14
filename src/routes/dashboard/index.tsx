import { useReadQuery } from "@apollo/client/react"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { Greeting, SectionHeader, StatRow } from "#/features/dashboard"
import { FabricCard } from "#/features/fabric"
import { ProposalRow } from "#/features/proposal"
import { Grid, VStack } from "#/features/ui"
import { MeDocument, RecentFabricsDocument } from "#/graphql/generated"

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const userQuery = context.preloadQuery(MeDocument)
		const recentFabricsQuery = context.preloadQuery(RecentFabricsDocument)

		return { userQuery, recentFabricsQuery }
	},
})

function RouteComponent() {
	const { userQuery, recentFabricsQuery } = Route.useLoaderData()
	const { data: userData } = useReadQuery(userQuery)
	const { data: recentFabricsData } = useReadQuery(recentFabricsQuery)

	if (!userData?.me) {
		throw redirect({ to: "/login", replace: true })
	}

	if (
		!recentFabricsData ||
		recentFabricsData.myFabrics.__typename === "UnauthorizedError"
	) {
		throw redirect({ to: "/login", replace: true })
	}

	return (
		<div>
			<VStack gap="8">
				<VStack gap="6">
					<Greeting
						userName={userData.me.name.split(" ")[0] ?? ""}
						numLikes={3}
					/>
					<StatRow
						stats={[
							{
								label: "fabrics",
								value: recentFabricsData.myFabrics.data.length ?? 0,
								neutral: true,
							},
							{
								label: "proposals",
								value: 4,
								delta: "1 unpublished",
								neutral: true,
							},
							{
								label: "total views",
								value: 8900,
								delta: "^ +12% this week",
							},
							{
								label: "likes",
								value: 341,
								delta: "^ 3 new",
							},
						]}
					/>
				</VStack>
				<VStack gap="9">
					<VStack gap="6">
						<SectionHeader
							type="fabrics"
							total={recentFabricsData.myFabrics.data.length ?? 0}
						/>
						<Grid gap="3" cols={3}>
							{recentFabricsData.myFabrics.data.map((fabric) => (
								<FabricCard
									lastEdited={fabric.updatedAt}
									title={fabric.title}
									key={fabric.id}
									id={fabric.id}
									location={`${fabric.locationCity}, ${fabric.locationRegion}`}
									mapImage={fabric.thumbnail ?? ""}
								/>
							))}
						</Grid>
					</VStack>
					<VStack gap="6">
						<SectionHeader type="proposals" total={4} />
						<VStack gap="2.5">
							<ProposalRow
								title="Main St: protected bike lanes & roundabouts"
								date="2026-05-20T14:48:00.000Z"
								status="published"
								location="Oak Park, IL"
								views={2400}
								likes={240}
								mapImage={
									<svg viewBox="0 0 80 64" xmlns="http://www.w3.org/2000/svg">
										<title>Example map image for a proposal</title>
										<rect width="80" height="64" fill="#f5f2ec"></rect>
										<rect
											x="0"
											y="26"
											width="80"
											height="12"
											fill="#d9d2c4"
										></rect>
										<rect
											x="0"
											y="26"
											width="80"
											height="3"
											fill="#d4735e"
											opacity="0.7"
										></rect>
										<circle
											cx="40"
											cy="32"
											r="7"
											fill="#d9d2c4"
											stroke="#c8c4ba"
											stroke-width="1"
										></circle>
										<circle cx="40" cy="32" r="3" fill="#b2e0d5"></circle>
										<circle
											cx="20"
											cy="22"
											r="5"
											fill="#1a6b5a"
											opacity="0.5"
										></circle>
										<circle
											cx="60"
											cy="22"
											r="5"
											fill="#1a6b5a"
											opacity="0.5"
										></circle>
									</svg>
								}
							/>
							<ProposalRow
								title="Harlem Ave dedicated bus lane — 12 min time savings"
								status="published"
								date="2026-06-03T14:48:00.000Z"
								location="Berwyn, IL"
								likes={143}
								views={5600}
								mapImage={
									<svg viewBox="0 0 80 64" xmlns="http://www.w3.org/2000/svg">
										<title>Example map image for a proposal</title>
										<rect width="80" height="64" fill="#f5f2ec"></rect>
										<rect
											x="0"
											y="26"
											width="80"
											height="12"
											fill="#d9d2c4"
										></rect>
										<rect
											x="0"
											y="26"
											width="80"
											height="3"
											fill="#d4901e"
											opacity="0.6"
										></rect>
										<rect
											x="18"
											y="24"
											width="12"
											height="8"
											fill="#1a6b5a"
											opacity="0.8"
											rx="1"
										></rect>
										<rect
											x="50"
											y="24"
											width="12"
											height="8"
											fill="#1a6b5a"
											opacity="0.8"
											rx="1"
										></rect>
									</svg>
								}
							/>
							<ProposalRow
								mapImage={
									<svg viewBox="0 0 80 64" xmlns="http://www.w3.org/2000/svg">
										<title>Example map image for a proposal</title>
										<rect width="80" height="64" fill="#f5f2ec"></rect>
										<rect
											x="0"
											y="22"
											width="80"
											height="10"
											fill="#d9d2c4"
										></rect>
										<rect
											x="30"
											y="0"
											width="10"
											height="64"
											fill="#d9d2c4"
										></rect>
										<rect
											x="0"
											y="22"
											width="80"
											height="3"
											fill="#1a6b5a"
											opacity="0.45"
										></rect>
									</svg>
								}
								title="Elm Ave shared street + widened sidewalks"
								status="draft"
								location="Oak Park, IL"
								date="2026-04-15T14:48:00.000Z"
							/>
						</VStack>
					</VStack>
				</VStack>
			</VStack>
		</div>
	)
}
