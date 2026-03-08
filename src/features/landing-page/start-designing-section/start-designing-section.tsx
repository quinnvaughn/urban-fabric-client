import { PencilLine } from "lucide-react"
import { Box, HStack, Link, Typography, VStack } from "#/features/ui"
import { button } from "#/styles/styled-system/recipes"
import { LandingPageSection } from "../section"

export function StartDesigningSection() {
	return (
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
						No account required. No expertise needed. Just open a map and start
						designing.
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
	)
}
