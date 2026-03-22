import { ApolloLink, HttpLink } from "@apollo/client"
import { ApolloClient, InMemoryCache } from "@apollo/client-integration-tanstack-start"
import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { getClientEnv } from "../env/client"

const getIncomingHeaders = createIsomorphicFn()
	.client(() => ({}))
	.server(() => {
		const typed = getRequestHeaders()
		const headers: Record<string, string> = {}
		for (const [key, value] of typed.entries()) {
			if (typeof value === "string") headers[key] = value
		}
		return headers
	})

const FORWARDED_HEADERS = ["cookie", "authorization", "accept-language"]

const withIncomingHeaders = new ApolloLink((operation, forward) => {
	const incoming = getIncomingHeaders() as Record<string, string>
	const next: Record<string, string> = {}
	for (const key of FORWARDED_HEADERS) {
		if (typeof incoming[key] === "string") next[key] = incoming[key]
	}
	operation.setContext(({ headers = {} }) => ({
		headers: { ...headers, ...next },
	}))
	return forward(operation)
})

export function createApolloClient() {
	return new ApolloClient({
		cache: new InMemoryCache(),
		link: ApolloLink.from([
			withIncomingHeaders,
			new HttpLink({ uri: getClientEnv().VITE_GRAPHQL_URL, credentials: "include" }),
		]),
	})
}
