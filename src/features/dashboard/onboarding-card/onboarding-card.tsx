import { Link } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { Box, Typography, VStack } from "#/features/ui"
import { css, cx } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"

export function OnboardingCard() {
	return (
		<Box
			className={css({
				background: "white",
				border: "1px solid",
				borderColor: "stone.200",
				borderRadius: "xl",
				py: "10",
				px: "9",
				display: "flex",
				alignItems: "center",
				gap: "9",
				boxShadow: "md",
				overflow: "hidden",
			})}
		>
			<VStack gap="8" className={css({ flex: 1, minWidth: 0 })}>
				<VStack gap="3">
					<VStack gap="2.5">
						<Typography.Text
							size="xxs"
							transform="uppercase"
							weight="semibold"
							color="accent.default"
							letterSpacing="wider"
						>
							Get started
						</Typography.Text>
						<Typography.Heading
							as="h2"
							lineHeight="tight"
							weight="light"
							size="lg"
							font="serif"
						>
							Your city. Your{" "}
							<Typography.Inline color="accent.default" fontStyle="italic">
								proposal.
							</Typography.Inline>
						</Typography.Heading>
					</VStack>
					<Typography.Text
						color="stone.500"
						size="md"
						className={css({ maxWidth: "460px" })}
					>
						A fabric is your working canvas — pick a street, drop some elements,
						see what's possible. When you're ready, publish it as a proposal and
						let your neighbourhood weigh in.
					</Typography.Text>
				</VStack>
				<Link
					preload={false}
					to="/fabric/new"
					className={cx(
						button({ size: "md", lift: true }),
						css({ alignSelf: "start" }),
					)}
				>
					<Plus size={12} />
					Create your first fabric
				</Link>
			</VStack>
			<Box
				className={css({
					flexShrink: 0,
					width: "220px",
					height: "140px",
					borderRadius: "lg",
					background: "stone.100",
					border: "1px solid",
					borderColor: "stone.200",
					overflow: "hidden",
					position: "relative",
					opacity: 0.9,
				})}
			>
				<svg
					viewBox="0 0 220 140"
					xmlns="http://www.w3.org/2000/svg"
					width="220"
					height="140"
				>
					<title>Onboarding card illustration</title>
					<rect width="220" height="140" fill="#f5f2ec"></rect>
					<rect x="0" y="0" width="80" height="58" fill="#ebe6dc" rx="2"></rect>
					<rect
						x="100"
						y="0"
						width="120"
						height="58"
						fill="#ebe6dc"
						rx="2"
					></rect>
					<rect
						x="0"
						y="80"
						width="80"
						height="60"
						fill="#ebe6dc"
						rx="2"
					></rect>
					<rect
						x="100"
						y="80"
						width="120"
						height="60"
						fill="#ebe6dc"
						rx="2"
					></rect>
					<rect x="0" y="58" width="220" height="22" fill="#d9d2c4"></rect>
					<rect x="80" y="0" width="20" height="140" fill="#d9d2c4"></rect>
					<rect
						x="0"
						y="76"
						width="220"
						height="4"
						fill="#278d75"
						opacity="0.7"
					></rect>
					<rect
						x="0"
						y="58"
						width="220"
						height="4"
						fill="#d4735e"
						opacity="0.75"
					></rect>
					<circle
						cx="90"
						cy="69"
						r="10"
						fill="#d9d2c4"
						stroke="#c8c4ba"
						stroke-width="1.5"
					></circle>
					<circle cx="90" cy="69" r="4.5" fill="#b2e0d5"></circle>
					<circle cx="38" cy="50" r="7" fill="#1a6b5a" opacity="0.45"></circle>
					<circle cx="155" cy="50" r="7" fill="#1a6b5a" opacity="0.45"></circle>
					<circle cx="38" cy="90" r="7" fill="#1a6b5a" opacity="0.45"></circle>
					<circle cx="155" cy="90" r="7" fill="#1a6b5a" opacity="0.45"></circle>
					<rect
						x="0"
						y="68"
						width="16"
						height="2"
						fill="white"
						opacity="0.5"
					></rect>
					<rect
						x="22"
						y="68"
						width="16"
						height="2"
						fill="white"
						opacity="0.5"
					></rect>
					<rect
						x="44"
						y="68"
						width="16"
						height="2"
						fill="white"
						opacity="0.5"
					></rect>
					<rect
						x="100"
						y="68"
						width="16"
						height="2"
						fill="white"
						opacity="0.5"
					></rect>
					<rect
						x="122"
						y="68"
						width="16"
						height="2"
						fill="white"
						opacity="0.5"
					></rect>
					<rect
						x="144"
						y="68"
						width="16"
						height="2"
						fill="white"
						opacity="0.5"
					></rect>
					<rect
						x="166"
						y="68"
						width="16"
						height="2"
						fill="white"
						opacity="0.5"
					></rect>
					<rect
						x="188"
						y="68"
						width="16"
						height="2"
						fill="white"
						opacity="0.5"
					></rect>
				</svg>
			</Box>
		</Box>
	)
}
