import { Typography, VStack } from "#/features/ui"
import { LandingPageSection } from "../section"
import { Steps } from "../steps"

export function HowItWorksSection() {
	return (
		<LandingPageSection bg="surface">
			<VStack gap="14">
				<VStack gap="3">
					<Typography.Text
						tone="muted"
						size="xs"
						transform="uppercase"
						weight="medium"
						tracking="wider"
					>
						How it works
					</Typography.Text>
					<Typography.Heading
						as="h2"
						size="lg"
						weight="light"
						font="serif"
						leading="tight"
					>
						Three steps from frustration
						<br /> to{" "}
						<Typography.Inline italic tone="accent">
							momentum.
						</Typography.Inline>
					</Typography.Heading>
				</VStack>
				<Steps />
			</VStack>
		</LandingPageSection>
	)
}
