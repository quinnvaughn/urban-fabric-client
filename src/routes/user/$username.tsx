import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { NotFoundView } from "#/features/errors"
import { Navbar } from "#/features/navigation"
import { ProfileContent } from "#/features/user"
import { GetUserProfileDocument } from "#/graphql/generated"
import { useAnalytics } from "#/lib/analytics"
import { getClientEnv } from "#/lib/env/client"

export const Route = createFileRoute("/user/$username")({
	component: RouteComponent,
	loader: async ({
		context: { preloadQuery, apolloClient },
		params: { username },
	}) => {
		const getUserQuery = preloadQuery(GetUserProfileDocument, {
			variables: { username },
		})
		const { data } = await apolloClient.query({
			query: GetUserProfileDocument,
			variables: { username },
		})

		return { getUserQuery, userData: data }
	},
	head: ({ loaderData }) => {
		const { VITE_SITE_URL: siteUrl } = getClientEnv()
		const user = loaderData?.userData?.user
		if (!user || user.__typename !== "User") {
			return { meta: [{ title: "Urban Fabric" }] }
		}
		const title = `${user.name} (@${user.username}) | Urban Fabric`
		const description =
			user.bio ??
			`Check out ${user.name}'s urban design proposals on Urban Fabric.`
		const image = user.profilePictureUrl ?? `${siteUrl}/og-image.png`
		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:image", content: image },
				{ property: "og:type", content: "profile" },
				{ name: "twitter:card", content: "summary" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
				{ name: "twitter:image", content: image },
			],
			links: [
				{
					rel: "canonical",
					href: `${siteUrl}/user/${user.username}`,
				},
			],
		}
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
	return (
		<>
			<Navbar />
			<ProfileContent user={data.user} />
		</>
	)
}
