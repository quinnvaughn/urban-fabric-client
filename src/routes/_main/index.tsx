import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRight, PencilLine } from "lucide-react"
import { LandingPageSection } from "#/features/landing-page"
import { Badge, Box, Grid, HStack, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"

export const Route = createFileRoute("/_main/")({ component: App })

function App() {
	return (
		<main>
			<LandingPageSection bg="base" minH="screen">
				<Grid columns="1fr 1fr" gap="8" align="center">
					<VStack gap="9">
						<VStack gap="7">
							<Badge tone="brand" style={{ display: "inline-flex", gap: "2" }}>
								<span
									className={css({
										width: "6px",
										height: "6px",
										borderRadius: "full",
										bg: "brand.default",
										flexShrink: 0,
									})}
								/>
								Urban design for everyone
							</Badge>
							<VStack gap="6">
								<Typography.Heading
									as="h1"
									weight="light"
									font="serif"
									leading="tight"
									tracking="tight"
									style={{ fontSize: "clamp(2.6rem, 4.5vw, 3.75rem)" }}
								>
									That stroad outside <br />
									your house?
									<br />
									<Typography.Inline italic tone="accent">
										Fix it. Make the case.
									</Typography.Inline>
								</Typography.Heading>
								<Box sx={{ maxW: "md" }}>
									<Typography.Text tone="muted" leading={"loose"}>
										Urban Fabric lets you redesign streets, intersections, and
										neighborhoods on a real map — then share your proposal where
										it'll actually be seen.
									</Typography.Text>
								</Box>
							</VStack>
						</VStack>
						<VStack gap="4">
							<HStack gap="4" align="center" wrap>
								<Link
									to="/proposal/new"
									className={button({
										appearance: "solid",
										intent: "accent",
										lift: true,
										size: "lg",
									})}
								>
									<PencilLine size={14} />
									Start designing
								</Link>
								<Link
									to="/proposal/explore"
									className={button({
										size: "lg",
										intent: "neutral",
										appearance: "outline",
									})}
								>
									Explore proposals <ArrowRight size={14} />
								</Link>
							</HStack>
							<Typography.Text tone="muted" size="xs">
								<Typography.Inline tone="default">
									No account needed
								</Typography.Inline>{" "}
								to start designing. Share when you're ready.
							</Typography.Text>
						</VStack>
					</VStack>
				</Grid>
			</LandingPageSection>
			<LandingPageSection bg="surface">
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
			</LandingPageSection>
			<LandingPageSection bg="base">
				<Grid columns="1fr 1fr" gap="8" align="center">
					<div />
					<VStack gap="3">
						<Typography.Text
							tone="muted"
							size="xs"
							transform="uppercase"
							weight="medium"
							tracking="wider"
						>
							What's a fabric?
						</Typography.Text>
						<Typography.Heading
							as="h2"
							size="lg"
							weight="light"
							font="serif"
							leading="tight"
						>
							Your vision,
							<br /> drawn on a{" "}
							<Typography.Inline italic tone="accent">
								real map.
							</Typography.Inline>
						</Typography.Heading>
					</VStack>
				</Grid>
			</LandingPageSection>
			<LandingPageSection bg="dark">
				<VStack gap="3">
					<Typography.Text
						tone="muted"
						size="xs"
						transform="uppercase"
						weight="medium"
						tracking="wider"
					>
						Who it's for
					</Typography.Text>
					<Typography.Heading
						as="h2"
						size="lg"
						weight="light"
						font="serif"
						leading="tight"
						tone="onDark"
					>
						If you've ever thought
						<br />
						<Typography.Inline italic tone="accent">
							"this could be so much better" —
						</Typography.Inline>
						<br />
						this is for you.
					</Typography.Heading>
				</VStack>
			</LandingPageSection>
			<LandingPageSection bg="surface">
				<VStack gap="3">
					<Typography.Text
						tone="muted"
						size="xs"
						transform="uppercase"
						weight="medium"
						tracking="wider"
					>
						Built to spread
					</Typography.Text>
					<Typography.Heading
						as="h2"
						size="lg"
						weight="light"
						font="serif"
						leading="tight"
					>
						Designed to drop
						<br />
						into the places
						<br />
						where{" "}
						<Typography.Inline italic tone="accent">
							change happens.
						</Typography.Inline>
					</Typography.Heading>
				</VStack>
			</LandingPageSection>
			<LandingPageSection bg="base">
				<Box
					sx={{
						maxWidth: "lg",
						marginInline: "auto",
						paddingInline: "10",
						textAlign: "center",
					}}
				>
					<VStack gap="4">
						<Typography.Heading
							style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
							weight="light"
							leading={"snug"}
							tracking={"snug"}
							font="serif"
						>
							Your street is
							<br /> waiting to be{" "}
							<Typography.Inline italic tone="accent">
								reimagined.
							</Typography.Inline>
						</Typography.Heading>
						<Typography.Text tone="muted" leading="loose">
							No account required. No expertise needed. Just open a map and
							start designing.
						</Typography.Text>
						<HStack gap="4" align="center" wrap>
							<Link
								to="/proposal/new"
								className={button({
									appearance: "solid",
									intent: "accent",
									lift: true,
									size: "lg",
								})}
							>
								<PencilLine size={14} />
								Start designing
							</Link>
							<Link
								to="/proposal/explore"
								className={button({
									size: "lg",
									intent: "neutral",
									appearance: "outline",
								})}
							>
								Browse proposals
							</Link>
						</HStack>
					</VStack>
				</Box>
			</LandingPageSection>
		</main>
	)
}
