import { z } from "zod"

const envSchema = z.object({
	VITE_STADIA_API_KEY: z.string().min(1, "VITE_STADIA_API_KEY must be set"),
	VITE_GOOGLE_CLIENT_ID: z
		.string()
		.min(1, "VITE_GOOGLE_CLIENT_ID must be set"),
	VITE_SITE_URL: z.string().min(1, "VITE_SITE_URL must be set"),
	VITE_GRAPHQL_URL: z.string().min(1, "VITE_GRAPHQL_URL must be set"),
	VITE_PUBLIC_POSTHOG_KEY: z.string().min(1, "VITE_PUBLIC_POSTHOG_KEY must be set"),
	VITE_PUBLIC_POSTHOG_HOST: z.string().min(1, "VITE_PUBLIC_POSTHOG_HOST must be set"),
})

export function getClientEnv() {
	return envSchema.parse(import.meta.env)
}
