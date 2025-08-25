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
			{
				name: "description",
				content:
					"An urban planning simulator for communities, creators, and cities.",
			},
			{
				name: "theme-color",
				content: "#10B981",
			},
			{
				name: "og:type",
				content: "website",
			},
			{
				name: "og:site_name",
				content: "Urban Fabric",
			},
			{
				name: "og:url",
				content: "https://urbanfabric.app",
			},
			{
				name: "og:title",
				content: "Urban Fabric",
			},
			{
				name: "og:description",
				content: "Run simulations, share ideas, and reimagine your city.",
			},
			{
				name: "og:image",
				content: "/og-image.jpg",
			},
			{
				name: "og:image:alt",
				content: "Urban Fabric map with “Simulate your city” overlay",
			},
			{
				name: "og:image:width",
				content: "1970",
			},
			{
				name: "og:image:height",
				content: "767",
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: "Urban Fabric",
			},
			{
				name: "twitter:description",
				content: "Run simulations, share ideas, and reimagine your city.",
			},
			{
				name: "twitter:image",
				content: "/og-image.jpg",
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
