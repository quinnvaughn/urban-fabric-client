import { useReadQuery } from "@apollo/client/index.js"
import { createFileRoute } from "@tanstack/react-router"
import { CurrentUserDocument } from "../graphql/generated"

export const Route = createFileRoute("/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const userRef = context.preloadQuery(CurrentUserDocument)

		return {
			userRef,
		}
	},
})

function useRequiredUser() {
	const { user } = Route.useRouteContext()
	if (!user) {
		throw new Error("User is required but not found in route context")
	}
	return user
}

function RouteComponent() {
	const user = useRequiredUser()
	return <div>Hello {user.name || "Guest"}!</div>
}
