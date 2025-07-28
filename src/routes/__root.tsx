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
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml",
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				sizes: "any",
			},
			{
				rel: "apple-touch-icon",
				href: "/favicon.png",
				sizes: "180x180",
			},
			{
				rel: "mask-icon",
				href: "/favicon.svg",
				color: "#10B981",
			},
			{
				rel: "manifest",
				href: "/site.webmanifest",
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
