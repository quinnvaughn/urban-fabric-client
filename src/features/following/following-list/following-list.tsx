import { Search, Users } from "lucide-react"
import { match } from "ts-pattern"
import { ProposalCard } from "#/features/proposal"
import {
	Box,
	EmptyState,
	Grid,
	LoadMore,
	Typography,
	VStack,
} from "#/features/ui"
import {
	FollowingProposalsDocument,
	type FollowingProposalsQuery,
} from "#/graphql/generated"
import { usePaginatedQuery } from "#/lib/hooks"
import { css } from "#/styles/styled-system/css"

type Props = {
	initialData: {
		items: FollowingProposalsQuery["followingProposals"]["proposals"]
		hasMore: FollowingProposalsQuery["followingProposals"]["hasMore"]
		total: FollowingProposalsQuery["followingProposals"]["total"]
	}
}

export function FollowingList({ initialData }: Props) {
	const {
		items: proposals,
		hasMore,
		total,
		loading,
		loadMore,
	} = usePaginatedQuery(FollowingProposalsDocument, {
		initialData,
		extractPayload: (d) =>
			d.followingProposals.__typename === "FollowingProposalsPayload"
				? {
						items: d.followingProposals.proposals,
						hasMore: d.followingProposals.hasMore,
						total: d.followingProposals.total,
					}
				: null,
		filterVars: {},
	})
	return (
		<Box className={css({ px: "7", paddingTop: "5", paddingBottom: "12" })}>
			<VStack gap="4">
				{initialData.total > 0 && (
					<Typography.Text size="sm" color="stone.400">
						{initialData.total} proposals
					</Typography.Text>
				)}
				{match(initialData.items)
					.when(
						(p) => p.length === 0,
						() => (
							<EmptyState
								icon={Users}
								title="Nobody here yet"
								description="Follow people on Urban Fabric and their new proposals will show up here."
								actionIcon={Search}
								actionLabel="Browse proposals"
								actionTo="/explore"
							/>
						),
					)
					.otherwise((p) => (
						<Grid cols={{ base: 1, md: 2, lg: 3, xl: 4 }} gap="4">
							{p.map((proposal) => (
								<ProposalCard key={proposal.id} proposal={proposal} />
							))}
						</Grid>
					))}
			</VStack>
			<LoadMore
				total={total}
				showing={proposals.length}
				hasMore={hasMore}
				loading={loading}
				onLoadMore={loadMore}
				hideEmpty
			/>
		</Box>
	)
}
