import { LinkIcon, Mail, MessageSquare } from "lucide-react"
import { Box, HStack, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { PlatformChip } from "../platform-chip"
import { LandingPageSection } from "../section"
import { SocialPost } from "../social-post"

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

export function BuiltToSpreadSection() {
	return (
		<LandingPageSection bg="surface">
			<Box
				className={css({
					display: "grid",
					gridTemplateColumns: { base: "1fr", md: "1fr 1fr" },
					gap: { base: "10", md: "20" },
					alignItems: "center",
				})}
			>
				<VStack gap="8">
					<VStack gap="5">
						<VStack gap="3">
							<Typography.Text
								tone="muted"
								size="xs"
								transform="uppercase"
								weight="medium"
								letterSpacing="wider"
							>
								Built to spread
							</Typography.Text>
							<Typography.Heading
								as="h2"
								size="lg"
								weight="light"
								font="serif"
								lineHeight="tight"
							>
								Designed to drop
								<br />
								into the places
								<br />
								where{" "}
								<Typography.Inline fontStyle="italic" tone="accent">
									change happens.
								</Typography.Inline>
							</Typography.Heading>
						</VStack>
						<Typography.Text tone="muted" lineHeight="relaxed" size="sm">
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
			</Box>
		</LandingPageSection>
	)
}
