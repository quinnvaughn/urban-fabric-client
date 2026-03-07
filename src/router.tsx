import { routerWithApolloClient } from "@apollo/client-integration-tanstack-start"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { createApolloClient } from "./lib/apollo/client"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
	const apolloClient = createApolloClient()
	const router = createTanStackRouter({
		routeTree,
		context: {
			...routerWithApolloClient.defaultContext,
		},
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
	})

	return routerWithApolloClient(router, apolloClient)
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}
