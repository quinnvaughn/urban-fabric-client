import { z } from "zod"

const envSchema = z.object({
	IP_WHO_KEY: z.string().min(1, "IP_WHO_KEY must be set"),
})

export function getServerEnv() {
	return envSchema.parse(process.env)
}
