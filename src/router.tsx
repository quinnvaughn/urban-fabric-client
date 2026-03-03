import { HttpLink } from "@apollo/client"
import {
	ApolloClient,
	InMemoryCache,
	routerWithApolloClient,
} from "@apollo/client-integration-tanstack-start"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
	const apolloClient = new ApolloClient({
		cache: new InMemoryCache(),
		link: new HttpLink({ uri: "http://localhost:4000" }),
	})
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
