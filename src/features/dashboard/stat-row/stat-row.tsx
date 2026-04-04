import { Grid } from "#/features/ui"
import { StatCard } from "../stat-card/stat-card"

type Props = {
	stats: React.ComponentProps<typeof StatCard>[]
}

export function StatRow({ stats }: Props) {
	return (
		<Grid gap="3" cols={{ base: 2, md: 3, xl: 5 }}>
			{stats.map((stat) => (
				<StatCard key={stat.label} {...stat} />
			))}
		</Grid>
	)
}
