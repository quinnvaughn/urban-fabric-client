import { createFileRoute } from "@tanstack/react-router"
import {
	Card,
	Container,
	Flex,
	LinkButton,
	Typography,
} from "../../features/ui"
import { css } from "../../styles/styled-system/css"

export const Route = createFileRoute("/_public/")({
	component: Home,
})

function Home() {
	return (
		<>
			<Container
				as="main"
				maxWidth="full"
				className={css({
					minHeight: "70vh",
					bg: "neutral.50",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				})}
			>
				<Flex
					direction="column"
					align="center"
					gap="lg"
					className={css({ width: "100%", maxWidth: "600px", py: "2xl" })}
				>
					<Typography.Heading textStyle="3xl" weight="bold" color="text">
						Simulate your city. Tell your story.
					</Typography.Heading>
					<Typography.Text textStyle="lg" color="muted">
						Explore, explain, and test changes to your built environment with
						Urban Fabric’s interactive planning simulator.
					</Typography.Text>
					<LinkButton to="/register" intent="primary" size="lg">
						Get Started for Free
					</LinkButton>
				</Flex>
			</Container>
			<Container
				maxWidth="full"
				as="section"
				className={css({
					py: "2xl",
				})}
			>
				<Flex direction="column" align="center" gap="md">
					<Typography.Heading textStyle="xl" weight="semibold" color="text">
						Why Urban Fabric?
					</Typography.Heading>
					<Flex gap="xl" className={css({ flexWrap: "wrap" })}>
						<FeatureBlurb
							title="Instant Feedback"
							body="Visualize planning scenarios in seconds—not days. Perfect for proposals and workshops."
						/>
						<FeatureBlurb
							title="AI-Assisted Insights"
							body="Generate, tweak, and compare plans using powerful generative tools."
						/>
						<FeatureBlurb
							title="Beautiful Exports"
							body="Share professional, map-based reports in one click—no GIS degree required."
						/>
					</Flex>
				</Flex>
			</Container>
		</>
	)
}

function FeatureBlurb(props: { title: string; body: string }) {
	return (
		<Card>
			<Flex
				direction="column"
				align="center"
				className={css({ maxWidth: "280px", textAlign: "center", px: "md" })}
			>
				<Typography.Heading textStyle="md" color="secondary" weight="semibold">
					{props.title}
				</Typography.Heading>
				<Typography.Text textStyle="sm" color="text">
					{props.body}
				</Typography.Text>
			</Flex>
		</Card>
	)
}
