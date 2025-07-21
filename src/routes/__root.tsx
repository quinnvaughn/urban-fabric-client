/// <reference types="vite/client" />
import type { ApolloClientRouterContext } from "@apollo/client-integration-tanstack-start"
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router"
import type { ReactNode } from "react"
import { CurrentUserDocument } from "../graphql/generated"
import { ToastProvider } from "../hooks"
import css from "../index.css?url"

export const Route = createRootRouteWithContext<ApolloClientRouterContext>()({
	beforeLoad: async ({ context: { apolloClient } }) => {
		const data = await apolloClient.query({ query: CurrentUserDocument })

		return { user: data.data.currentUser }
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Urban Fabric",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: css,
			},
		],
	}),
	component: RootComponent,
})

function RootComponent() {
	return (
		<RootDocument>
			<ToastProvider>
				<Outlet />
			</ToastProvider>
		</RootDocument>
	)
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	)
}
