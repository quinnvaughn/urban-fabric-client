import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { MapPin } from "lucide-react"
import { Box, HStack, Logo, Typography } from "#/features/ui"
import { GetProposalDocument } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/proposal/$slug/")({
	component: RouteComponent,
	loader: ({ params, context }) => {
		const getProposalQuery = context.preloadQuery(GetProposalDocument, {
			variables: {
				slug: params.slug,
			},
		})
		return {
			getProposalQuery,
		}
	},
})

function RouteComponent() {
	const { getProposalQuery } = Route.useLoaderData()
	const { data } = useReadQuery(getProposalQuery)

	if (
		!data ||
		!data.proposalBySlug ||
		data.proposalBySlug.__typename === "NotFoundError"
	) {
		// TODO: better 404 page
		return <div>Proposal not found</div>
	}
	return (
		<Box
			className={css({
				display: "flex",
				flexDir: "column",
				background: "stone.100",
				h: "screen",
				w: "screen",
			})}
		>
			<Box
				id="top-bar"
				className={css({
					flexShrink: 0,
					height: "var(--uf-header-height)",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					px: "4",
					gap: "2.5",
					borderBottom: "1px solid",
					borderBottomColor: "stone.300",
					background: "white",
					zIndex: "floating",
					animation: "fadeDown 0.36s (--easings-spring) both",
					transition:
						"height 250ms (--easings-spring), opacity 200ms (---easings-in-out), border-bottom-color 200ms",
					overflow: "hidden",
				})}
			>
				<HStack
					gap="2.5"
					className={css({ flex: 1, minWidth: 0 })}
					align="center"
				>
					<Logo />
					<Box
						className={css({
							width: "px",
							height: "18px",
							background: "stone.200",
							flexShrink: 0,
						})}
					/>
					<Typography.Text truncate color="stone.700" weight="medium" size="md">
						{data.proposalBySlug.title}
					</Typography.Text>
					<HStack
						gap="1"
						align="center"
						className={css({ flexShrink: 0, color: "stone.500" })}
					>
						<MapPin size={10} />
						<Typography.Text
							size="xs"
							className={css({ color: "inherit" })}
						>{`${data.proposalBySlug.snapshotLocationCity}, ${data.proposalBySlug.snapshotLocationRegionAbbr ?? data.proposalBySlug.snapshotLocationRegion}`}</Typography.Text>
					</HStack>
				</HStack>
			</Box>
		</Box>
	)
}
