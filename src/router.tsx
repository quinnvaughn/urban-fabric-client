import { HttpLink } from "@apollo/client/index.js"
import {
	ApolloClient,
	InMemoryCache,
	routerWithApolloClient,
} from "@apollo/client-integration-tanstack-start"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

let getCleanHeaders: () => Record<string, string> = () => ({})
if (typeof window === "undefined") {
	const { getHeaders } = await import("@tanstack/react-start/server")
	getCleanHeaders = () => {
		const raw = getHeaders()
		const clean: Record<string, string> = {}
		for (const [k, v] of Object.entries(raw)) {
			if (typeof v === "string") clean[k] = v
		}
		return clean
	}
}
export function createRouter() {
	const apolloClient = new ApolloClient({
		cache: new InMemoryCache(),
		link: new HttpLink({
			uri: "http://localhost:4000",
			credentials: "include",
			headers: getCleanHeaders(),
		}),
	})
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		context: {} as any,
	})

	return routerWithApolloClient(router, apolloClient)
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>
	}
}
