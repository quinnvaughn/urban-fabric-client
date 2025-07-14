import { useReadQuery } from "@apollo/client/index.js"
import { createFileRoute } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { css } from "../../../../../styled-system/css"
import {
	AppLink,
	Card,
	Flex,
	Grid,
	Icon,
	Typography,
} from "../../../../features/ui"
import { IconButton } from "../../../../features/ui/icon-button"
import { UserCanvasesDocument } from "../../../../graphql/generated"
import { formatTimeAgo, truncate } from "../../../../utils"

export const Route = createFileRoute("/_auth/dashboard/_shell/")({
	component: DashboardPage,
	loader: ({ context: { preloadQuery } }) => {
		const queryRef = preloadQuery(UserCanvasesDocument)
		return {
			queryRef,
		}
	},
})

function DashboardPage() {
	const { queryRef } = Route.useLoaderData()
	const { data } = useReadQuery(queryRef)
	const canvases = data.currentUser?.canvases || []
	const navigate = Route.useNavigate()
	return (
		<Flex direction="column" gap="lg">
			<Typography.Heading level={1}>Dashboard</Typography.Heading>
			<Grid gap="md" templateColumns="repeat(auto-fill, minmax(300px, 1fr))">
				{match(canvases)
					.when(
						(canvases) => canvases.length > 0,
						(canvases) =>
							canvases.map((canvas) => (
								// biome-ignore lint/a11y/useSemanticElements: ignored
								<Card
									key={canvas.id}
									role="button"
									tabIndex={0}
									onClick={() => {
										navigate({
											to: "/dashboard/canvas/$canvasId",
											params: { canvasId: canvas.id },
										})
									}}
								>
									<Card.Header>
										<Card.Title>{canvas.name}</Card.Title>

										{canvas.description && (
											<Card.Description>
												{truncate(canvas.description, 120)}
											</Card.Description>
										)}
										<Card.Action>
											<IconButton
												icon="DotsThreeVertical"
												onClick={(e) => {
													e.stopPropagation()
													// TODO: Implement canvas actions
													console.log("Clicked")
												}}
											/>
										</Card.Action>
									</Card.Header>
									<Card.Footer className={css({ alignItems: "flex-start" })}>
										<Typography.Text color="muted" textStyle={"sm"}>
											Last edited {formatTimeAgo(canvas.updatedAt)}
										</Typography.Text>
										{canvas.published && (
											<Typography.Text
												color="primary"
												weight="medium"
												textStyle={"sm"}
											>
												Published
											</Typography.Text>
										)}
									</Card.Footer>
								</Card>
							)),
					)
					.otherwise(() => (
						<Typography.Text color="muted">Loading projects...</Typography.Text>
					))}
			</Grid>
		</Flex>
	)
}
