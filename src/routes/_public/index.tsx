import { createFileRoute } from "@tanstack/react-router"
import hero from "../../assets/urban-fabric-hero.png"
import { EmbeddedForm } from "../../features/landing-page"
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
		<Container maxWidth={"full"} className={css({ p: "0" })}>
			<section
				className={css({
					position: "relative",
					bg: { base: "white", md: "gray.50" },
					borderBottomWidth: "1px",
					borderColor: "neutral.200",
					paddingY: "lg",
					// subtle grid background (no image assets)
					_before: {
						content: '""',
						position: "absolute",
						inset: 0,
						pointerEvents: "none",
						opacity: 0.08,
						backgroundImage:
							"linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
						backgroundSize: "24px 24px",
						color: "#0f766e", // tame teal; swap to your brand color token if you want
					},
				})}
			>
				<Container>
					<Flex
						align={"start"}
						wrap={"wrap"}
						gap={"md"}
						justify={"between"}
						className={css({ position: "relative" })}
					>
						<Flex
							direction={"column"}
							align={"start"}
							gap="sm"
							className={css({ flexBasis: { base: "100%", md: "55%" } })}
						>
							<Typography.Text
								textStyle={"sm"}
								className={css({ color: "neutral.600" })}
							>
								Early-alpha access
							</Typography.Text>

							<Typography.Text textStyle="2xl">Urban Fabric</Typography.Text>
							<Typography.Text
								className={css({ maxW: "65ch", color: "neutral.700" })}
							>
								Simulate street changes and test scenarios fast. Start from
								templates (safer crossings, bike lanes, housing tweaks) or build
								from scratch. Share results as interactive embeds and use them
								in your own campaigns and media.
							</Typography.Text>

							<LinkButton
								// @ts-ignore
								to="#signup"
							>
								Join the early‑alpha waitlist
							</LinkButton>
						</Flex>
						<div
							className={css({
								display: { base: "none", md: "block" },
								flexBasis: { md: "40%" },
								maxW: "500px", // cap how wide it ever gets
							})}
						>
							<div
								className={css({
									aspectRatio: "2940 / 1838", // preserve native ratio
									borderRadius: "lg",
									overflow: "hidden",
									boxShadow: "md",
									border: "1px solid",
									borderColor: "gray.200",
									bg: "white",
								})}
							>
								<img
									src={hero}
									alt="Urban Fabric"
									width={2940}
									height={1838}
									loading="lazy"
									decoding="async"
									className={css({
										width: "100%",
										height: "100%",
										objectFit: "cover",
										display: "block",
									})}
								/>
							</div>
						</div>
					</Flex>
				</Container>
			</section>
			<section
				className={css({
					paddingTop: { base: "lg", md: "xl" },
					paddingBottom: { base: "xl", md: "2xl" },
					borderTopWidth: "1px",
					borderColor: "neutral.200",
					bg: "white",
				})}
			>
				<Container>
					<Card className={css({ padding: { base: "lg", md: "xl" } })}>
						<Flex direction={"column"} gap="md">
							<Typography.Heading level={2} weight={"semibold"} textStyle="xl">
								What is Urban Fabric?
							</Typography.Heading>
							<Typography.Text className={css({ color: "neutral.700" })}>
								Urban Fabric is a map-first simulator for street and
								neighborhood changes. Test ideas quickly, see the impact, and
								share your scenarios anywhere.
							</Typography.Text>
							<ul
								className={css({
									display: "grid",
									gap: "sm",
									pl: "lg",
									listStyleType: "disc",
									color: "neutral.700",
								})}
							>
								<li>Map-first design — no GIS experience required</li>
								<li>
									Templates for common changes (bike lanes, safer crossings)
								</li>
								<li>Fast, visual scenario testing</li>
								<li>Easy sharing via interactive embeds</li>
							</ul>
							<Typography.Text
								textStyle={"sm"}
								className={css({
									color: "neutral.600",
								})}
							>
								We’ll review applicants before granting early-alpha access.
							</Typography.Text>
							{/* Anchor for the hero CTA */}
							<div id="signup" />
							<EmbeddedForm />
						</Flex>
					</Card>
				</Container>
			</section>
		</Container>
	)
}
