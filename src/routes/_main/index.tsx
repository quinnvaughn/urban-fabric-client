import { createFileRoute, Link } from "@tanstack/react-router"
import {
	ArrowRight,
	Check,
	Eye,
	Link as LinkIcon,
	Mail,
	MessageSquare,
	PencilLine,
} from "lucide-react"
import {
	HeroProposalMap,
	LandingPageSection,
	PlatformChip,
	SocialPost,
	Steps,
	WhatIsAFabricMap,
	WhoCard,
} from "#/features/landing-page"
import {
	Avatar,
	Badge,
	Box,
	Card,
	Grid,
	HStack,
	Typography,
	VStack,
} from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"

export const Route = createFileRoute("/_main/")({ component: App })

const fabricItems = [
	"Draw on any real street, anywhere in the world",
	"Set attributes — bike lanes, crosswalks, roundabouts, transit lanes, tree canopy",
	"No urban planning background or GIS software required",
	"Publish as a proposal when you're ready to share",
]

const platforms: { icon: React.ReactNode; label: string }[] = [
	{
		icon: (
			<svg width="12" height="12" viewBox="0 0 24 24" fill="#FF4500">
				<title>Reddit</title>
				<path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701z"></path>
			</svg>
		),
		label: "Reddit",
	},
	{
		icon: (
			<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
				<title>Twitter</title>
				<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
			</svg>
		),
		label: "X / Twitter",
	},
	{
		icon: <MessageSquare size={12} color="var(--colors-fg-muted)" />,
		label: "Nextdoor",
	},
	{
		icon: <Mail size={12} color="var(--colors-fg-muted)" />,
		label: "City council email",
	},
	{
		icon: <LinkIcon size={12} color="var(--colors-fg-muted)" />,
		label: "Anywhere with a link",
	},
]

function App() {
	return (
		<main>
			<LandingPageSection bg="base" minH="screen">
				<Grid columns="1fr 1fr" gap="8" align="center">
					<VStack gap="9">
						<VStack gap="7">
							<Badge
								tone="brand"
								style={{ display: "inline-flex", gap: "2" }}
								uppercase
								size="sm"
							>
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
					<Card>
						<Card.Media style={{ position: "relative" }}>
							<Badge
								style={{ position: "absolute", top: "12px", right: "12px" }}
								tone="accent"
								appearance="solid"
							>
								Proposed
							</Badge>
							<HeroProposalMap />
						</Card.Media>
						<Card.Body>
							<VStack gap="3">
								<VStack gap="1">
									<Badge tone="brand" uppercase>
										<Check size={12} />
										Street conversion
									</Badge>
									<Typography.Text
										weight="normal"
										size="md"
										font="serif"
										leading="snug"
									>
										Main St: protected bike lanes & roundabouts at every
										intersection
									</Typography.Text>
									<Typography.Text size="xs" tone="muted">
										Converts 4-lane stroad to 2-lane street with buffered bike
										lanes, planted medians, and pedestrian-priority
										intersections.
									</Typography.Text>
								</VStack>
								<HStack justify="between" align="center">
									<HStack gap="2" align="center">
										<Avatar
											name="jackie r"
											size="xs"
											tone="brand"
											appearance="subtle"
										/>
										<Typography.Text size="xs" tone="muted">
											jackie_r · Oak Park, IL
										</Typography.Text>
									</HStack>
									<HStack gap="3" align="center">
										<HStack gap="0.5">
											<Eye size={12} color="var(--colors-fg-muted)" />
											<Typography.Text size="xs" tone="muted">
												2.4k
											</Typography.Text>
										</HStack>
										<HStack gap="0.5">
											<MessageSquare size={12} color="var(--colors-fg-muted)" />
											<Typography.Text size="xs" tone="muted">
												84
											</Typography.Text>
										</HStack>
									</HStack>
								</HStack>
							</VStack>
						</Card.Body>
					</Card>
				</Grid>
			</LandingPageSection>
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
			<LandingPageSection bg="base">
				<Grid columns="1fr 1fr" gap="20" align="center">
					<Card>
						<Card.Media style={{ position: "relative" }}>
							<Badge
								style={{ position: "absolute", top: "12px", left: "12px" }}
								tone="neutral"
								appearance="solid"
							>
								Before
							</Badge>
							<Badge
								style={{ position: "absolute", top: "12px", right: "12px" }}
								tone="brand"
								appearance="solid"
							>
								Proposed
							</Badge>
							<WhatIsAFabricMap />
						</Card.Media>
					</Card>
					<VStack gap="8">
						<VStack gap="4">
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
							<Typography.Text tone="muted" leading="relaxed" size="sm">
								A Fabric is your design layer on top of the real world. You're
								not working in the abstract — you're drawing on actual streets
								in your actual city. Add a protected bike lane on the road you
								cross every day. Turn that six-lane arterial into something a
								human would want to walk down.
							</Typography.Text>
						</VStack>
						<ul
							className={css({
								display: "flex",
								flexDirection: "column",
								gap: "3",
								listStyle: "none",
								padding: "0",
								margin: "0",
							})}
						>
							{fabricItems.map((item) => (
								<li
									key={item}
									className={css({
										display: "flex",
										alignItems: "baseline",
										gap: "2.5",
									})}
								>
									<span
										className={css({
											width: "1.5",
											height: "1.5",
											borderRadius: "full",
											background: "accent.default",
											flexShrink: "0",
											position: "relative",
											top: "-1px",
										})}
									/>
									<Typography.Text size="sm" color="stone.700">
										{item}
									</Typography.Text>
								</li>
							))}
						</ul>
					</VStack>
				</Grid>
			</LandingPageSection>
			<LandingPageSection bg="dark">
				<VStack gap="14">
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
			<LandingPageSection bg="surface">
				<Grid columns="1fr 1fr" gap="20" align="center">
					<VStack gap="8">
						<VStack gap="5">
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
							<Typography.Text tone="muted" leading="relaxed" size="sm">
								Every proposal gets its own shareable page. Post it in the
								subreddit. Quote-tweet the city's planning announcement. Send it
								to your council member. The link does the work.
							</Typography.Text>
						</VStack>
						<HStack gap="3" align="center" wrap>
							{platforms.map((platform) => (
								<PlatformChip key={platform.label} {...platform} />
							))}
						</HStack>
					</VStack>
					<VStack gap="4">
						<SocialPost
							platform="reddit"
							body="I made a proper proposal for converting Broadway Ave in my city. Before/after on a real map. If you're in Columbus, please share this with your rep."
							comments={134}
							shares={312}
							upvotes={847}
							subreddit="fuckcars"
							username="strongtowns_fanatic"
							linkPreview={{
								title: "Broadway Ave: protected lanes + roundabouts",
								url: "urbanfabric.app/proposals/broadway-ave-columbus",
							}}
						/>
						<SocialPost
							platform="twitter"
							handle="nottawa_urbanist"
							body="Here's exactly what I want the city to do with the Rideau St corridor. Took 20 minutes to design. Now let's see if @OttawaCity can manage it in 20 years."
							impressions={2100}
							likes={418}
							retweets={209}
						/>
					</VStack>
				</Grid>
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
