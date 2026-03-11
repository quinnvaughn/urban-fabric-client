import { createFileRoute, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"
import { match } from "ts-pattern"
import { CreateFabricDocument, MeDocument } from "#/graphql/generated"

const getLocationFromIp = createServerFn({ method: "GET" }).handler(
	async () => {
		const ip =
			getRequestHeader("x-forwarded-for") ?? getRequestHeader("x-real-ip")
		const res = await fetch(`http://ip-api.com/json/${ip ?? ""}?fields=lat,lon`)
		const { lat, lon } = await res.json()
		return { lat, lng: lon }
	},
)

export const Route = createFileRoute("/fabric/new")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const response = context.apolloClient.readQuery({
			query: MeDocument,
		})
		// if user is logged in, generate a fabric and redirect to it
		if (response?.me) {
			const center = await getLocationFromIp()
			const fabricResponse = await context.apolloClient.mutate({
				mutation: CreateFabricDocument,
				variables: {
					input: {
						center,
					},
				},
			})
			const result = fabricResponse.data?.createFabric
			return match(result)
				.with({ __typename: "UnauthorizedError" }, () => {
					throw redirect({ to: "/login", replace: true })
				})
				.with({ __typename: "Fabric" }, ({ id }) => {
					throw redirect({ to: `/fabric/$id`, params: { id }, replace: true })
				})
				.with(undefined, () => {
					throw redirect({ to: "/login", replace: true })
				})
				.exhaustive()
		}
	},
})

function RouteComponent() {
	return <div>Hello "/fabric/new"!</div>
}
