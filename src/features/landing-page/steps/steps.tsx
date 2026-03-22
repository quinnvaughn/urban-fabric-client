import { Box, Divider, Typography } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

const steps = [
	{
		number: "01",
		label: "Design a Fabric",
		description:
			"Open any street on a real map. Draw your changes — add a bike lane, swap a signal for a roundabout, widen a sidewalk. No GIS experience required. If you can see the problem, you can design the fix.",
		bg: "brand.subtle",
		color: "brand.default",
	},
	{
		number: "02",
		label: "Publish a proposal",
		description:
			"When your Fabric is ready, give it a title and context. Publish it as a proposal — a shareable page that shows your before, your vision, and your reasoning.",
		bg: "accent.subtle",
		color: "accent.default",
	},
	{
		number: "03",
		label: "Make the case",
		description:
			"Post it. Drop it in the subreddit. Share it with your city council rep. Show people what's possible. A picture of a better street is worth a thousand words at a planning meeting.",
		bg: "bg.muted",
		color: "fg.muted",
	},
]

export function Steps() {
	return (
		<div
			className={css({
				display: "grid",
				gridTemplateColumns: { base: "1fr", md: "repeat(3, 1fr)" },
				position: "relative",
			})}
		>
			<div
				className={css({
					position: "absolute",
					top: "7",
					left: "calc(33.33% / 2)",
					right: "calc(33.33% / 2)",
					h: "px",
					background: "border.subtle",
					zIndex: "base",
					display: { base: "none", md: "block" },
				})}
			/>
			{steps.map((step, i) => (
				<div key={step.number}>
					<div
						className={css({
							px: { base: "0", md: "10" },
							pt: "0",
							pb: { base: "8", md: "10" },
							zIndex: "raised",
							borderLeft: {
								base: "none",
								md: i > 0 ? "1px solid {colors.border.subtle}" : "none",
							},
						})}
					>
						{/* Number badge */}
						<div
							className={css({
								display: "flex",
								alignItems: "center",
								pb: { base: "6", md: "8" },
							})}
						>
							<div
								className={css({
									w: "14",
									h: "14",
									borderRadius: "lg",
									flexShrink: 0,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									background: step.bg,
								})}
							>
								<span
									className={css({
										fontFamily: "serif",
										fontStyle: "italic",
										fontSize: "2xl",
										color: step.color,
									})}
								>
									{step.number}
								</span>
							</div>
						</div>
						<Box
							className={css({
								display: "flex",
								flexDirection: "column",
								gap: { base: "2.5", md: "3" },
							})}
						>
							<Typography.Heading as="h3" size="sm" font="serif" weight="light">
								{step.label}
							</Typography.Heading>
							<Typography.Text size="sm" tone="muted" lineHeight="relaxed">
								{step.description}
							</Typography.Text>
						</Box>
					</div>
					{i < steps.length - 1 && (
						<div
							className={css({
								display: { base: "block", md: "none" },
								paddingBottom: "10",
							})}
						>
							<Divider />
						</div>
					)}
				</div>
			))}
		</div>
	)
}
