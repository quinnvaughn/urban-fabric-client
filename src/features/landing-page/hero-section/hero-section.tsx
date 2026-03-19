import { ArrowRight, Check, Eye, MessageSquare, PencilLine } from "lucide-react"
import {
	Avatar,
	Badge,
	Box,
	Card,
	Grid,
	HStack,
	Link,
	Typography,
	VStack,
} from "#/features/ui"
import { css, cx } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"
import { HeroProposalMap } from "../hero-proposal-map"
import { LandingPageSection } from "../section"

export function HeroSection() {
	return (
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
								lineHeight="tight"
								letterSpacing="tight"
								style={{ fontSize: "clamp(2.6rem, 4.5vw, 3.75rem)" }}
							>
								That stroad outside <br />
								your house?
								<br />
								<Typography.Inline fontStyle="italic" tone="accent">
									Fix it. Make the case.
								</Typography.Inline>
							</Typography.Heading>
							<Box className={css({ maxW: "md" })}>
								<Typography.Text tone="muted" lineHeight="loose">
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
								to="/fabric/new"
								className={cx(
									button({
										appearance: "solid",
										intent: "brand",
										lift: true,
										size: "lg",
									}),
									css({ textDecoration: "none" }),
								)}
							>
								<PencilLine size={14} />
								Start designing
							</Link>
							<Link
								to="/proposal/explore"
								className={cx(
									button({
										size: "lg",
										intent: "neutral",
										appearance: "outline",
									}),
									css({ textDecoration: "none" }),
								)}
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
							tone="brand"
							appearance="solid"
						>
							Proposed
						</Badge>
						<HeroProposalMap />
					</Card.Media>
					<Card.Body>
						<VStack gap="3">
							<VStack gap="1">
								<HStack gap="1" align="center">
									<Check size={12} color="var(--colors-fg-muted)" />
									<Typography.Text tone="muted" size="xs">
										Street conversion
									</Typography.Text>
								</HStack>
								<Typography.Text
									weight="normal"
									size="md"
									font="serif"
									lineHeight="snug"
								>
									Main St: protected bike lanes & roundabouts at every
									intersection
								</Typography.Text>
								<Typography.Text size="xs" tone="muted">
									Converts 4-lane stroad to 2-lane street with buffered bike
									lanes, planted medians, and pedestrian-priority intersections.
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
	)
}
