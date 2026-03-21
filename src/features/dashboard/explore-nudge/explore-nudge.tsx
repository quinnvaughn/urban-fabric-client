import { Link } from "@tanstack/react-router"
import { ChevronRight, Search } from "lucide-react"
import { Box, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

export function ExploreNudge() {
	return (
		<Link
			to="/dashboard/explore"
			className={css({
				background:
					"linear-gradient(135deg, var(--colors-teal-700) 0%, var(--colors-teal-600) 100%)",
				borderRadius: "xl",
				py: "6",
				px: "7",
				display: "flex",
				alignItems: "center",
				color: "white",
				gap: "5",
				cursor: "pointer",
				transition: "transform 150ms, box-shadow 150ms",
				boxShadow: "0 4px 16px rgba(26,107,90,0.25)",
				_hover: {
					transform: "translateY(-2px)",
					boxShadow: "0 6px 20px rgba(26,107,90,0.3)",
				},
			})}
		>
			<Box
				className={css({
					width: "12",
					height: "12",
					borderRadius: "full",
					background: "rgba(255,255,255,0.15)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: "0",
					color: "white",
				})}
			>
				<Search size={22} />
			</Box>
			<VStack
				gap="1"
				className={css({ flex: 1, height: "100%" })}
				justify="start"
			>
				<Typography.Text
					size="xxs"
					weight="semibold"
					letterSpacing="wider"
					transform="uppercase"
					className={css({ opacity: 0.7, color: "inherit" })}
				>
					Community
				</Typography.Text>
				<Typography.Text
					size="xl"
					weight="light"
					lineHeight="snug"
					font="serif"
					className={css({ color: "inherit" })}
				>
					See what your neighbours are{" "}
					<Typography.Inline
						className={css({ color: "inherit" })}
						fontStyle="italic"
					>
						building
					</Typography.Inline>
				</Typography.Text>
				<Typography.Text
					size="sm"
					className={css({ opacity: 0.7, color: "inherit" })}
				>
					Browse proposals from urbanists in your area for some inspiration.
				</Typography.Text>
			</VStack>
			<ChevronRight
				className={css({ color: "rgba(255,255,255,0.6)", flexShrink: 0 })}
			/>
		</Link>
	)
}
