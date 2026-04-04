import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { useAnalytics } from "#/lib/analytics"
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
import type {
	MeQuery,
	MyDashboardStatsQuery,
	RecentFabricsQuery,
	RecentProposalsQuery,
} from "#/graphql/generated"
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

type Me = NonNullable<MeQuery["me"]>
type RecentFabricsPayload = Extract<
	RecentFabricsQuery["myFabrics"],
	{ __typename: "MyFabricsPayload" }
>
type RecentProposalsPayload = Extract<
	RecentProposalsQuery["myProposals"],
	{ __typename: "MyProposalsPayload" }
>
type DashboardStatsPayload = Extract<
	MyDashboardStatsQuery["myDashboardStats"],
	{ __typename: "DashboardStats" }
>

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
	const { capture } = useAnalytics()
	useEffect(() => {
		capture("page_viewed", { page: "dashboard" })
	}, [capture])
	const { data: recentFabricsData } = useReadQuery(recentFabricsQuery)
	const { data: recentProposalsData } = useReadQuery(recentProposalsQuery)
	const { data: dashboardStatsData } = useReadQuery(dashboardStatsQuery)

	if (
		!userData?.me ||
		recentFabricsData.myFabrics.__typename === "UnauthorizedError" ||
		recentProposalsData.myProposals.__typename === "UnauthorizedError" ||
		dashboardStatsData.myDashboardStats.__typename === "UnauthorizedError"
	) {
		return null
	}

	return (
		<DashboardContent
			me={userData.me}
			recentFabrics={recentFabricsData.myFabrics}
			recentProposals={recentProposalsData.myProposals}
			dashboardStats={dashboardStatsData.myDashboardStats}
		/>
	)
}

function DashboardContent({
	me,
	recentFabrics,
	recentProposals,
	dashboardStats,
}: {
	me: Me
	recentFabrics: RecentFabricsPayload
	recentProposals: RecentProposalsPayload
	dashboardStats: DashboardStatsPayload
}) {
	const hasFabrics = recentFabrics.fabrics.length > 0
	const hasProposals = recentProposals.proposals.length > 0

	return (
		<DashboardContainer>
			<VStack gap="8">
				<VStack gap="6">
					<Greeting
						hasFabrics={hasFabrics}
						userName={me.name.split(" ")[0] ?? ""}
						numLikes={dashboardStats.proposalLikesDelta}
					/>
					{!hasFabrics && <OnboardingCard />}
					<StatRow
						stats={[
							{
								label: "fabrics",
								value: recentFabrics.total,
								neutral: true,
							},
							{
								label: "proposals",
								value: dashboardStats.proposalCount,
								delta: deltaText(
									dashboardStats.unpublishedProposalCount,
									`${dashboardStats.unpublishedProposalCount} unpublished`,
								),
								neutral: true,
							},
							{
								label: "total views",
								value: dashboardStats.totalProposalViews,
								delta: deltaText(
									dashboardStats.proposalViewsDelta,
									`^ +${dashboardStats.proposalViewsDelta}% this week`,
								),
							},
							{
								label: "comments",
								value: dashboardStats.totalProposalComments,
								delta: deltaText(
									dashboardStats.proposalCommentsDelta,
									`^ ${dashboardStats.proposalCommentsDelta} this week`,
								),
							},
							{
								label: "likes",
								value: dashboardStats.totalProposalLikes,
								delta: deltaText(
									dashboardStats.proposalLikesDelta,
									`^ ${dashboardStats.proposalLikesDelta} this week`,
								),
							},
						]}
					/>
				</VStack>
				<VStack gap="9">
					<VStack gap="6">
						<SectionHeader type="fabrics" total={recentFabrics.total} />
						{hasFabrics ? (
							<Grid gap="3" cols={3}>
								{recentFabrics.fabrics.map((fabric) => (
									<FabricCard fabric={fabric} key={fabric.id} />
								))}
							</Grid>
						) : (
							<EmptySection type="fabric" />
						)}
					</VStack>
					<VStack gap="6">
						<SectionHeader type="proposals" total={recentProposals.total} />
						{hasProposals ? (
							<VStack gap="2.5">
								{recentProposals.proposals.map((proposal) => (
									<ProposalRow
										id={proposal.id}
										fabricId={proposal.fabricId}
										title={proposal.title}
										date={proposal.updatedAt}
										isPublished={proposal.isPublished}
										location={`${proposal.snapshotLocationCity}, ${proposal.snapshotLocationRegion}`}
										views={proposal.viewCount}
										comments={proposal.commentCount}
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
