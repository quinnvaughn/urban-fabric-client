import { Grid, Typography, VStack } from "#/features/ui"
import { LandingPageSection } from "../section"
import { WhoCard } from "../who-card"

export function WhoItIsForSection() {
	return (
		<LandingPageSection bg="dark">
			<VStack gap="14">
				<VStack gap="3">
					<Typography.Text
						tone="muted"
						size="xs"
						transform="uppercase"
						weight="medium"
						letterSpacing="wider"
					>
						Who it's for
					</Typography.Text>
					<Typography.Heading
						as="h2"
						size="lg"
						weight="light"
						font="serif"
						lineHeight="tight"
						tone="onDark"
					>
						If you've ever thought
						<br />
						<Typography.Inline fontStyle="italic" tone="accent">
							"this could be so much better" —
						</Typography.Inline>
						<br />
						this is for you.
					</Typography.Heading>
				</VStack>
				<Grid columns="1fr 1fr 1fr" gap="8">
					<WhoCard
						icon="🎥"
						iconBgColor="rgba(26,107,90,0.25)"
						title="Urbanism creators"
						body="You've been making the case in videos and threads. Now you can show the specific fix on the actual street — not just the concept, but the proposal."
						quote="Stop theorizing about what a protected bike lane looks like. Draw it."
					/>
					<WhoCard
						icon="🏘"
						iconBgColor="rgba(212,115,94,0.2)"
						title="Neighborhood advocates"
						body="Bring something concrete to the next planning meeting. A well-designed proposal is harder to dismiss than a petition or a complaint."
						quote="Show up with a map. Not just a concern."
					/>
					<WhoCard
						icon="🌱"
						iconBgColor="rgba(217,240,234,0.1)"
						title="Community groups & nonprofits"
						body="Align your members around a shared vision. Share proposals publicly to build momentum, gather feedback, and demonstrate community support."
						quote="Turn your community's frustration into a concrete ask."
					/>
				</Grid>
			</VStack>
		</LandingPageSection>
	)
}
