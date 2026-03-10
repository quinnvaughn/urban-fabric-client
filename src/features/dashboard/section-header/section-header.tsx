import { HStack, Link, Typography } from "#/features/ui"

type Props = {
	type: "fabrics" | "proposals"
	total: number
}

export function SectionHeader({ total, type }: Props) {
	return (
		<HStack align="baseline" justify="between">
			<HStack gap="2.5" align="baseline">
				<Typography.Text size="md" weight="semibold">
					{type === "fabrics" ? "Recent Fabrics" : "My Proposals"}
				</Typography.Text>
				<Typography.Text size="sm" weight="normal" color="stone.400">
					{total} total
				</Typography.Text>
			</HStack>
			<Link
				size="sm"
				to={type === "fabrics" ? "/dashboard/fabrics" : "/dashboard/proposals"}
			>
				View all
			</Link>
		</HStack>
	)
}
