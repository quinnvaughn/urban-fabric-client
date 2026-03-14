import { Typography, VStack } from "#/features/ui"
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
				gridTemplateColumns: "repeat(3, 1fr)",
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
				})}
			/>
			{steps.map((step, i) => (
				<div
					key={step.number}
					className={css({
						px: "10",
						pt: "0",
						pb: "10",
						zIndex: "raised",
						borderLeft: i > 0 ? "1px solid {colors.border.subtle}" : undefined,
					})}
				>
					{/* Number badge + line */}
					<div
						className={css({ display: "flex", alignItems: "center", mb: "8" })}
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
					<VStack gap="3">
						<Typography.Heading as="h3" size="sm" font="serif" weight="light">
							{step.label}
						</Typography.Heading>
						<Typography.Text size="sm" tone="muted" leading="relaxed">
							{step.description}
						</Typography.Text>
					</VStack>
				</div>
			))}
		</div>
	)
}
