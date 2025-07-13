import { useReadQuery } from "@apollo/client/index.js"
import { createFileRoute } from "@tanstack/react-router"
import React from "react"
import { css } from "../../../../../styled-system/css"
import { Card, Typography } from "../../../../features/ui"
import { UserCanvasesDocument } from "../../../../graphql/generated"

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
	return (
		<React.Fragment>
			<Typography.Heading level={1}>Dashboard</Typography.Heading>
			{data.currentUser?.canvases.map((canvas) => (
				<Card key={canvas.id} className={css({ maxWidth: "sm" })}>
					<Typography.Text>{canvas.name}</Typography.Text>
				</Card>
			))}
		</React.Fragment>
	)
}
