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
					href: "/logo.svg",
					type: "image/svg+xml",
				},
				{
					rel: "icon",
					href: "/favicon.ico",
					type: "image/x-icon",
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
				<ToastProvider>{children}</ToastProvider>
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
