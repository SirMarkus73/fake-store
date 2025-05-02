import { envSchema } from "@/schemas/envSchema"

export const { PORT, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = envSchema.parse(
  process.env,
)
