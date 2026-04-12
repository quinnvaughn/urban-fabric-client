import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { NotFoundView } from "#/features/errors"
import { ProfileContent } from "#/features/user"
import { GetUserProfileDocument } from "#/graphql/generated"
import { useAnalytics } from "#/lib/analytics"

export const Route = createFileRoute("/dashboard/user/$username")({
	component: RouteComponent,
	loader: ({ context: { preloadQuery }, params: { username } }) => {
		const getUserQuery = preloadQuery(GetUserProfileDocument, {
			variables: { username },
		})

		return { getUserQuery }
	},
})

function RouteComponent() {
	const { getUserQuery } = Route.useLoaderData()
	const { data } = useReadQuery(getUserQuery)
	const { capture } = useAnalytics()

	// biome-ignore lint/correctness/useExhaustiveDependencies: capture is stable
	useEffect(() => {
		capture("page_viewed", { page: "profile" })
	}, [])

	if (data.user.__typename === "NotFoundError") {
		return <NotFoundView />
	}
	return <ProfileContent user={data.user} />
}
