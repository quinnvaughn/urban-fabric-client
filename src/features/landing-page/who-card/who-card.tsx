import { Box, Typography, VStack } from "#/features/ui"
import { css } from "@/styles/styled-system/css"

type Props = {
	title: string
	body: string
	quote: string
	icon: string
	iconBgColor: string
}

export function WhoCard({ title, body, quote, icon, iconBgColor }: Props) {
	return (
		<Box
			className={css({
				border: "1px solid rgba(255, 255, 255, 0.08)",
				borderRadius: "lg",
				padding: "8",
				transition: "background-color 0.2s",
				bg: {
					base: "rgba(255,255,255,0.04)",
					_hover: "rgba(255,255,255,0.07)",
				},
			})}
		>
			<VStack gap="5">
				<Box
					className={css({
						width: "11",
						height: "11",
						borderRadius: "md",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					})}
					style={{ backgroundColor: iconBgColor }}
				>
					{icon}
				</Box>
				<VStack gap="2">
					<Typography.Text size="lg" weight="light" font="serif" tone="onDark">
						{title}
					</Typography.Text>
					<Typography.Text size="sm" tone="onDarkMuted" leading="relaxed">
						{body}
					</Typography.Text>
					<Typography.Text
						size="xs"
						tone="onDarkMuted"
						font="serif"
						italic
						className={css({
							paddingTop: "4",
							borderTop: "1px solid rgba(255,255,255,0.08)",
						})}
					>
						"{quote}"
					</Typography.Text>
				</VStack>
			</VStack>
		</Box>
	)
}
