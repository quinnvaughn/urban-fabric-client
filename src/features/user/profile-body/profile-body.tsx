import { useState } from "react"
import { ProposalCard } from "#/features/proposal"
import { Box, Grid, Tabs, VStack } from "#/features/ui"
import type { UserProfileFragment } from "#/graphql/generated"
import { useCurrentUser } from "#/lib/graphql"
import { css } from "#/styles/styled-system/css"

type Props = {
	user: UserProfileFragment
}

export function ProfileBody({ user }: Props) {
	const { user: me } = useCurrentUser()
	const [tab, setTab] = useState<"proposals" | "liked">("proposals")
	return (
		<Box
			className={css({
				paddingTop: "5",
				px: "7",
				paddingBottom: "20",
				bg: "stone.100",
				flex: 1,
			})}
		>
			<VStack gap="5">
				<Tabs
					size="md"
					value={tab}
					onValueChange={(v) => setTab(v as "proposals" | "liked")}
				>
					<Tabs.List>
						<Tabs.Trigger value="proposals">Proposals</Tabs.Trigger>
						{user.id === me?.id && (
							<Tabs.Trigger value="liked">Liked</Tabs.Trigger>
						)}
					</Tabs.List>
				</Tabs>
				<Grid gap="3.5" columns="repeat(auto-fill, minmax(240px, 1fr)">
					{tab === "proposals"
						? user.proposals.map((p) => (
								<ProposalCard key={p.id} proposal={p} />
							))
						: user.likedProposals?.map((p) => (
								<ProposalCard key={p.id} proposal={p} />
							))}
				</Grid>
			</VStack>
		</Box>
	)
}
