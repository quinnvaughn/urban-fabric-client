import { useReadQuery } from "@apollo/client/index.js"
import { createFileRoute } from "@tanstack/react-router"
import React from "react"
import { match } from "ts-pattern"
import { css } from "../../../../../styled-system/css"
import { AppLink, Card, Flex, Typography } from "../../../../features/ui"
import { UserCanvasesDocument } from "../../../../graphql/generated"
import { formatTimeAgo, truncate } from "../../../../utils"

export const Route = createFileRoute("/_auth/dashboard/_shell/")({
	component: RouteComponent,
	loader: ({ context: { preloadQuery } }) => {
		const queryRef = preloadQuery(UserCanvasesDocument)
		return {
			queryRef,
		}
	},
})

function RouteComponent() {
	const { queryRef } = Route.useLoaderData()
	const { data } = useReadQuery(queryRef)
	const canvases = data.currentUser?.canvases || []
	return (
		<Flex direction="column" gap="lg">
			<Typography.Heading level={1}>Dashboard</Typography.Heading>
			<Flex wrap={"wrap"} gap="md">
				{match(canvases)
					.when(
						(canvases) => canvases.length > 0,
						(canvases) =>
							canvases.map((canvas) => (
								<AppLink
									key={canvas.id}
									to={"/dashboard/$canvasId"}
									params={{ canvasId: canvas.id }}
									className={css({
										textDecoration: "none",
										flex: "1 1 300px",
										maxWidth: "sm",
									})}
								>
									<Card key={canvas.id} className={css({ maxWidth: "sm" })}>
										<Flex
											direction="column"
											gap="sm"
											className={css({ p: "md" })}
										>
											<Typography.Heading level={4}>
												{canvas.name}
											</Typography.Heading>

											{canvas.description && (
												<Typography.Text color="muted">
													{truncate(canvas.description, 120)}
												</Typography.Text>
											)}

											<Flex justify="between" align="center">
												<Typography.Text color="muted">
													Last edited {formatTimeAgo(canvas.updatedAt)}
												</Typography.Text>
												{canvas.published && (
													<Typography.Text color="primary" weight="medium">
														Published
													</Typography.Text>
												)}
											</Flex>
										</Flex>
									</Card>
								</AppLink>
							)),
					)
					.otherwise(() => (
						<Typography.Text color="muted">Loading projects...</Typography.Text>
					))}
			</Flex>
		</Flex>
	)
}
