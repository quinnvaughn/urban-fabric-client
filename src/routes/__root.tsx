import type { ApolloClientIntegration } from "@apollo/client-integration-tanstack-start"
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router"
import { ToastProvider } from "#/features/ui"
import { MeDocument } from "#/graphql/generated"
import { getClientEnv } from "#/lib/env/client"
import { ModalRenderer } from "#/providers"
import appCss from "../index.css?url"

export const Route =
	createRootRouteWithContext<ApolloClientIntegration.RouterContext>()({
		beforeLoad: async ({ context }) => {
			await context.apolloClient.query({ query: MeDocument })
		},
		head: () => {
			const { VITE_SITE_URL: siteUrl } = getClientEnv()
			const description =
				"Redesign any street on a real map. Add bike lanes, remove parking, propose roundabouts — then publish your proposal where it'll actually be seen."
			return {
				meta: [
					{ charSet: "utf-8" },
					{ name: "viewport", content: "width=device-width, initial-scale=1" },
					{ title: "Urban Fabric" },
					{ name: "description", content: description },
					{ property: "og:site_name", content: "Urban Fabric" },
					{ property: "og:title", content: "Urban Fabric" },
					{ property: "og:description", content: description },
					{ property: "og:image", content: `${siteUrl}/og-image.png` },
					{ property: "og:type", content: "website" },
					{ name: "twitter:card", content: "summary_large_image" },
					{ name: "twitter:title", content: "Urban Fabric" },
					{ name: "twitter:description", content: description },
					{ name: "twitter:image", content: `${siteUrl}/og-image.png` },
				],
				links: [
					{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
					{
						rel: "icon",
						href: "/favicon-96x96.png",
						type: "image/png",
						sizes: "96x96",
					},
					{ rel: "icon", href: "/favicon.ico", sizes: "48x48" },
					{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
					{ rel: "manifest", href: "/manifest.json" },
					{ rel: "preconnect", href: "https://fonts.googleapis.com" },
					{
						rel: "preconnect",
						href: "https://fonts.gstatic.com",
						crossOrigin: "anonymous",
					},
					{
						rel: "stylesheet",
						href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swap",
					},
					{ rel: "stylesheet", href: appCss },
				],
			}
		},
		shellComponent: RootDocument,
	})

function RootDocument({ children }: { children: React.ReactNode }) {
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
				<Scripts />
			</body>
		</html>
	)
}
