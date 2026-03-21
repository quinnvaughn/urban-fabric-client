import { Layers, Plus } from "lucide-react"
import { match } from "ts-pattern"
import { Box, Link, Typography } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Props = {
	type: "fabric" | "proposal"
}
export function EmptySection({ type }: Props) {
	return (
		<Box
			className={css({
				background: "white",
				border: "1px dashed",
				borderColor: "stone.300",
				borderRadius: "xl",
				py: "10",
				px: "6",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
				gap: "2",
			})}
		>
			<Box
				className={css({
					color: "stone.400",
					width: "10",
					height: "10",
					borderRadius: "full",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "stone.100",
				})}
			>
				{match(type)
					.with("proposal", () => (
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>proposal icon</title>
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
							<polyline points="14 2 14 8 20 8"></polyline>
						</svg>
					))
					.with("fabric", () => <Layers size={16} />)
					.exhaustive()}
			</Box>
			<Typography.Text size="md" color="stone.700" weight="semibold">
				{match(type)
					.with("proposal", () => "No proposals published")
					.with("fabric", () => "No fabrics yet")
					.exhaustive()}
			</Typography.Text>
			<Typography.Text
				size="sm"
				className={css({ maxW: "280px" })}
				color="stone.400"
			>
				{match(type)
					.with(
						"proposal",
						() =>
							"Proposals are snapshots of your fabric — publish one to share your street vision with the community.",
					)
					.with(
						"fabric",
						() =>
							"A fabric is your working canvas for a street redesign. Start with any street in your city.",
					)
					.exhaustive()}
			</Typography.Text>
			<Link size="sm" to={"/fabric/new"} preload={false}>
				<Plus size={13} />
				{match(type)
					.with("proposal", () => "Create a fabric to get started")
					.with("fabric", () => "Create a fabric")
					.exhaustive()}
			</Link>
		</Box>
	)
}
