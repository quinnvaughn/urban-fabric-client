import { createFileRoute } from "@tanstack/react-router"
import { css } from "../../styled-system/css"
import { button } from "../../styled-system/recipes"
import { AppLink, Container, Flex, Typography } from "../features/ui"

export const Route = createFileRoute("/")({
	component: Home,
})

function Home() {
	return (
		<>
			<Container
				as="header"
				className={css({
					bg: "surface",
					boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)",
					py: "sm",
					px: "md",
				})}
			>
				<Flex align="center" justify="between">
					<Typography.Heading textStyle="lg" weight="bold" color="primary">
						Urban Fabric
					</Typography.Heading>
					<Flex gap="md" align="center">
						<AppLink to="/login" variant="secondary">
							Login
						</AppLink>
						<AppLink
							to="/register"
							className={button({
								variant: "primary",
								size: "sm",
							})}
						>
							Sign Up
						</AppLink>
					</Flex>
				</Flex>
			</Container>
			<Container
				as="main"
				className={css({
					minHeight: "70vh",
					bg: "background",
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
					<Typography.Text textStyle="lg" color="secondary">
						Explore, explain, and test changes to your built environment with
						Urban Fabric’s interactive planning simulator.
					</Typography.Text>
					<AppLink
						to="/register"
						className={button({
							variant: "primary",
							size: "lg",
						})}
					>
						Get Started for Free
					</AppLink>
				</Flex>
			</Container>
			<Container
				as="section"
				className={css({
					bg: "surface",
					py: "2xl",
					borderRadius: "xl",
					boxShadow: "0 4px 32px 0 rgba(16,185,129,0.05)",
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
			<footer>
				<Container className={css({ py: "sm" })}>
					<Typography.Text
						textStyle="sm"
						color="secondary"
						className={css({ textAlign: "center" })}
					>
						© {new Date().getFullYear()} Urban Fabric. All rights reserved.
					</Typography.Text>
				</Container>
			</footer>
		</>
	)
}

function FeatureBlurb(props: { title: string; body: string }) {
	return (
		<Flex
			direction="column"
			align="center"
			className={css({ maxWidth: "280px", textAlign: "center", px: "md" })}
		>
			<Typography.Heading textStyle="md" color="primary" weight="semibold">
				{props.title}
			</Typography.Heading>
			<Typography.Text textStyle="sm" color="secondary">
				{props.body}
			</Typography.Text>
		</Flex>
	)
}
