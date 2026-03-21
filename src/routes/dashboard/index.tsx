import { useReadQuery } from "@apollo/client/react"
import { createFileRoute, redirect } from "@tanstack/react-router"
import {
	DashboardContainer,
	EmptySection,
	ExploreNudge,
	Greeting,
	OnboardingCard,
	SectionHeader,
	StatRow,
} from "#/features/dashboard"
import { FabricCard } from "#/features/fabric"
import { ProposalRow } from "#/features/proposal"
import { Grid, VStack } from "#/features/ui"
import {
	MeDocument,
	MyDashboardStatsDocument,
	RecentFabricsDocument,
	RecentProposalsDocument,
} from "#/graphql/generated"

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const userQuery = context.preloadQuery(MeDocument)
		const recentFabricsQuery = context.preloadQuery(RecentFabricsDocument, {
			variables: { limit: 3 },
		})
		const recentProposalsQuery = context.preloadQuery(RecentProposalsDocument, {
			variables: { limit: 3 },
		})
		const dashboardStatsQuery = context.preloadQuery(MyDashboardStatsDocument)

		return {
			userQuery,
			recentFabricsQuery,
			recentProposalsQuery,
			dashboardStatsQuery,
		}
	},
})

function deltaText(count: number, text: string): string | undefined {
	return count > 0 ? text : undefined
}

function RouteComponent() {
	const {
		userQuery,
		recentFabricsQuery,
		recentProposalsQuery,
		dashboardStatsQuery,
	} = Route.useLoaderData()
	const { data: userData } = useReadQuery(userQuery)
	const { data: recentFabricsData } = useReadQuery(recentFabricsQuery)
	const { data: recentProposalsData } = useReadQuery(recentProposalsQuery)
	const { data: dashboardStatsData } = useReadQuery(dashboardStatsQuery)

	if (
		!userData?.me ||
		recentFabricsData.myFabrics.__typename === "UnauthorizedError" ||
		recentProposalsData.myProposals.__typename === "UnauthorizedError" ||
		dashboardStatsData.myDashboardStats.__typename === "UnauthorizedError"
	) {
		throw redirect({ to: "/login", replace: true })
	}

	const hasFabrics = recentFabricsData.myFabrics.fabrics.length > 0
	const hasProposals = recentProposalsData.myProposals.proposals.length > 0

	return (
		<DashboardContainer>
			<VStack gap="8">
				<VStack gap="6">
					<Greeting
						hasFabrics={hasFabrics}
						userName={userData.me.name.split(" ")[0] ?? ""}
						numLikes={dashboardStatsData.myDashboardStats.proposalLikesDelta}
					/>
					{!hasFabrics && <OnboardingCard />}
					<StatRow
						stats={[
							{
								label: "fabrics",
								value: recentFabricsData.myFabrics.total,
								neutral: true,
							},
							{
								label: "proposals",
								value: dashboardStatsData.myDashboardStats.proposalCount,
								delta: deltaText(
									dashboardStatsData.myDashboardStats.unpublishedProposalCount,
									`${dashboardStatsData.myDashboardStats.unpublishedProposalCount} unpublished`,
								),
								neutral: true,
							},
							{
								label: "total views",
								value: dashboardStatsData.myDashboardStats.totalProposalViews,
								delta: deltaText(
									dashboardStatsData.myDashboardStats.proposalViewsDelta,
									`^ +${dashboardStatsData.myDashboardStats.proposalViewsDelta}% this week`,
								),
							},
							{
								label: "likes",
								value: dashboardStatsData.myDashboardStats.totalProposalLikes,
								delta: deltaText(
									dashboardStatsData.myDashboardStats.proposalLikesDelta,
									`^ ${dashboardStatsData.myDashboardStats.proposalLikesDelta} this week`,
								),
							},
						]}
					/>
				</VStack>
				<VStack gap="9">
					<VStack gap="6">
						<SectionHeader
							type="fabrics"
							total={recentFabricsData.myFabrics.total}
						/>
						{hasFabrics ? (
							<Grid gap="3" cols={3}>
								{recentFabricsData.myFabrics.fabrics.map((fabric) => (
									<FabricCard fabric={fabric} key={fabric.id} />
								))}
							</Grid>
						) : (
							<EmptySection type="fabric" />
						)}
					</VStack>
					<VStack gap="6">
						<SectionHeader
							type="proposals"
							total={recentProposalsData.myProposals.total}
						/>
						{hasProposals ? (
							<VStack gap="2.5">
								{recentProposalsData.myProposals.proposals.map((proposal) => (
									<ProposalRow
										id={proposal.id}
										fabricId={proposal.fabricId}
										title={proposal.title}
										date={proposal.updatedAt}
										isPublished={proposal.isPublished}
										location={`${proposal.snapshotLocationCity}, ${proposal.snapshotLocationRegion}`}
										views={proposal.viewCount}
										likes={proposal.likeCount}
										slug={proposal.slug}
										mapImage={proposal.snapshotThumbnail}
										key={proposal.id}
									/>
								))}
							</VStack>
						) : (
							<EmptySection type="proposal" />
						)}
					</VStack>
					{(!hasFabrics || !hasProposals) && <ExploreNudge />}
				</VStack>
			</VStack>
		</DashboardContainer>
	)
}
