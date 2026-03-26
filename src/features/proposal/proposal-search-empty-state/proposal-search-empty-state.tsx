import { Link } from "@tanstack/react-router"
import { Layers, Plus } from "lucide-react"
import { Box, Typography, VStack } from "#/features/ui"
import { css, cx } from "#/styles/styled-system/css"
import { vstack } from "#/styles/styled-system/patterns"
import { button } from "#/styles/styled-system/recipes"

export function ProposalSearchEmptyState() {
	return (
		<Box
			className={cx(
				vstack(),
				css({
					paddingTop: "16",
					paddingBottom: "12",
					px: "6",
				}),
			)}
		>
			<VStack gap="6" align="center">
				<VStack gap="2" align="center">
					<VStack gap="5" align="center">
						<Box
							className={css({
								w: "52px",
								h: "52px",
								background: "stone.200",
								borderRadius: "full",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "stone.400",
							})}
						>
							<Layers size={22} />
						</Box>
						<Typography.Text
							font="serif"
							weight="light"
							size="2xl"
							lineHeight="snug"
							color="stone.700"
							fontStyle="italic"
						>
							Nothing here yet.
						</Typography.Text>
					</VStack>
					<Typography.Text size="md" color="stone.400">
						Every redesign starts somewhere. Why not make this one yours?
					</Typography.Text>
				</VStack>
				<Link className={button({ intent: "brand" })} to="/fabric/new">
					<Plus size={14} /> Start a fabric
				</Link>
			</VStack>
		</Box>
	)
}
