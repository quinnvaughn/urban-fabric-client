import type { ApolloClientIntegration } from "@apollo/client-integration-tanstack-start"
import { TanStackDevtools } from "@tanstack/react-devtools"
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { useEffect, useState } from "react"
import { ToastProvider } from "#/features/ui"
import { MeDocument } from "#/graphql/generated"
import { ModalRenderer } from "#/providers"
import appCss from "../index.css?url"

export const Route =
	createRootRouteWithContext<ApolloClientIntegration.RouterContext>()({
		beforeLoad: async ({ context }) => {
			await context.apolloClient.query({ query: MeDocument })
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
					rel: "icon",
					href: "/favicon.svg",
					type: "image/svg+xml",
				},
				{
					rel: "icon",
					href: "/favicon-96x96.png",
					type: "image/png",
					sizes: "96x96",
				},
				{
					rel: "icon",
					href: "/favicon.ico",
					sizes: "48x48",
				},
				{
					rel: "apple-touch-icon",
					href: "/apple-touch-icon.png",
				},
				{
					rel: "manifest",
					href: "/manifest.json",
				},
				{
					rel: "preconnect",
					href: "https://fonts.googleapis.com",
				},
				{
					rel: "preconnect",
					href: "https://fonts.gstatic.com",
					crossOrigin: "anonymous",
				},
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swap",
				},
				{
					rel: "stylesheet",
					href: appCss,
				},
			],
		}),
		shellComponent: RootDocument,
	})

function RootDocument({ children }: { children: React.ReactNode }) {
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [])

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<ToastProvider>
					<ModalRenderer />
					{children}
				</ToastProvider>
				{isClient ? (
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
						]}
					/>
				) : null}
				<Scripts />
			</body>
		</html>
	)
}
