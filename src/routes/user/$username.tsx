import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { NotFoundView } from "#/features/errors"
import { Navbar } from "#/features/navigation"
import { ProfileContent } from "#/features/user"
import { GetUserProfileDocument } from "#/graphql/generated"

export const Route = createFileRoute("/user/$username")({
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

	if (data.user.__typename === "NotFoundError") {
		return <NotFoundView />
	}
	return (
		<>
			<Navbar />
			<ProfileContent user={data.user} />
		</>
	)
}
