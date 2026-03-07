import {
	ArrowBigUp,
	Heart,
	MessageSquare,
	MoveUpRight,
	Repeat,
} from "lucide-react"
import { match } from "ts-pattern"
import { Avatar, Box, Card, HStack, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type RedditPost = {
	platform: "reddit"
	username: string // "strongtowns_fanatic"
	subreddit: string // "FUCKCARS"
	upvotes: number // "847"
	body: string
	comments: number
	shares: number
	linkPreview?: { title: string; url: string }
}

type TwitterPost = {
	platform: "twitter"
	handle: string // "nottawa_urbanist"
	impressions: number // "2.1K"
	body: string
	likes: number
	retweets: number
}

type Props = RedditPost | TwitterPost

export function SocialPost(props: Props) {
	return (
		<Card className={css({ background: "stone.50" })} size="sm">
			<Card.Body>
				<VStack gap="4">
					<HStack gap="4" align={"center"}>
						<Avatar
							size="sm"
							name={props.platform === "reddit" ? props.username : props.handle}
							tone={props.platform === "reddit" ? "brand" : "accent"}
							appearance="subtle"
						/>
						<VStack gap="0">
							<Typography.Text color="stone.700" size="sm" weight="medium">
								{props.platform === "reddit"
									? `u/${props.username}`
									: `@${props.handle}`}
							</Typography.Text>
							<Typography.Text
								color="stone.400"
								size="xs"
								tracking="wider"
								transform={"uppercase"}
							>
								{props.platform === "reddit"
									? `R/${props.subreddit} · ${props.upvotes} upvotes`
									: `Twitter/X · ${new Intl.NumberFormat("en", { notation: "compact" }).format(props.impressions)} impressions`}
							</Typography.Text>
						</VStack>
					</HStack>
					<Typography.Text color="stone.700" size="sm">
						{props.body}
					</Typography.Text>
					{props.platform === "reddit" && props.linkPreview && (
						<Box
							className={css({
								display: "flex",
								alignItems: "center",
								gap: "2",
								background: "white",
								border: "1px solid var(--colors-stone-200)",
								borderRadius: "md",
								py: "2.5",
								px: "3",
							})}
						>
							<img src="/logo.svg" alt="Urban Fabric" width={28} height={28} />
							<VStack gap="0">
								<Typography.Text size="xs" weight="semibold">
									{props.linkPreview.title}
								</Typography.Text>
								<Typography.Text size="xs" color="stone.400">
									{props.linkPreview.url}
								</Typography.Text>
							</VStack>
						</Box>
					)}

					{match(props)
						.with({ platform: "reddit" }, (p) => (
							<HStack gap="4" align="center">
								<HStack gap="1">
									<ArrowBigUp size={16} color="var(--colors-stone-400)" />
									<Typography.Text size="xs" color="stone.400">
										{new Intl.NumberFormat("en", {
											notation: "compact",
										}).format(p.upvotes)}
									</Typography.Text>
								</HStack>
								<HStack gap="1">
									<MessageSquare size={16} color="var(--colors-stone-400)" />
									<Typography.Text size="xs" color="stone.400">
										{new Intl.NumberFormat("en", {
											notation: "compact",
										}).format(p.comments)}{" "}
										comments
									</Typography.Text>
								</HStack>
								<HStack gap="1">
									<MoveUpRight size={14} color="var(--colors-stone-400)" />
									<Typography.Text size="xs" color="stone.400">
										{new Intl.NumberFormat("en", {
											notation: "compact",
										}).format(p.shares)}{" "}
										shares
									</Typography.Text>
								</HStack>
							</HStack>
						))
						.with({ platform: "twitter" }, (p) => (
							<HStack gap="4" align="center">
								<HStack gap="1">
									<Heart
										fill="var(--colors-stone-400)"
										size={12}
										color="var(--colors-stone-400)"
									/>
									<Typography.Text size="xs" color="stone.400">
										{new Intl.NumberFormat("en", {
											notation: "compact",
										}).format(p.likes)}
									</Typography.Text>
								</HStack>
								<HStack gap="1">
									<Repeat size={16} color="var(--colors-stone-400)" />
									<Typography.Text size="xs" color="stone.400">
										{new Intl.NumberFormat("en", {
											notation: "compact",
										}).format(p.retweets)}{" "}
										retweets
									</Typography.Text>
								</HStack>
							</HStack>
						))
						.exhaustive()}
				</VStack>
			</Card.Body>
		</Card>
	)
}
