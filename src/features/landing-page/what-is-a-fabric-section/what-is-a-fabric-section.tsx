import { Badge, Card, Grid, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { LandingPageSection } from "../section"
import { WhatIsAFabricMap } from "../what-is-a-fabric-map"

const fabricItems = [
	"Draw on any real street, anywhere in the world",
	"Set attributes — bike lanes, crosswalks, roundabouts, transit lanes, tree canopy",
	"No urban planning background or GIS software required",
	"Publish as a proposal when you're ready to share",
]

export function WhatIsAFabricSection() {
	return (
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
								letterSpacing="wider"
							>
								What's a fabric?
							</Typography.Text>
							<Typography.Heading
								as="h2"
								size="lg"
								weight="light"
								font="serif"
								lineHeight="tight"
							>
								Your vision,
								<br /> drawn on a{" "}
								<Typography.Inline fontStyle="italic" tone="accent">
									real map.
								</Typography.Inline>
							</Typography.Heading>
						</VStack>
						<Typography.Text tone="muted" lineHeight="relaxed" size="sm">
							A Fabric is your design layer on top of the real world. You're not
							working in the abstract — you're drawing on actual streets in your
							actual city. Add a protected bike lane on the road you cross every
							day. Turn that six-lane arterial into something a human would want
							to walk down.
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
										background: "brand.default",
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
	)
}
