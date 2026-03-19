import { Card, Typography, VStack } from "#/features/ui"

type Props = {
	label: string
	value: number
	// this is too variable to be a number, it could be a percentage, a currency, etc. so we will just use a string
	delta?: string
	neutral?: boolean
}

export function StatCard({ label, value, delta, neutral }: Props) {
	return (
		<Card lift="sm" size="sm" shadow="sm">
			<Card.Body>
				<VStack gap="1.5">
					<Typography.Text
						size="xxs"
						color="stone.500"
						transform={"uppercase"}
						weight="medium"
						lineHeight="none"
						letterSpacing="wide"
					>
						{label}
					</Typography.Text>
					<Typography.Text size="2xl" weight="bold" lineHeight="none">
						{new Intl.NumberFormat("en-US", { notation: "compact" }).format(
							value,
						)}
					</Typography.Text>
					<Typography.Text
						size="xs"
						color={neutral ? "stone.500" : "teal.700"}
						lineHeight="none"
						weight="medium"
					>
						{delta}
					</Typography.Text>
				</VStack>
			</Card.Body>
		</Card>
	)
}
