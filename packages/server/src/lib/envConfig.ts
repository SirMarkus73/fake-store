import { envSchema } from "@server/schemas/envSchema"

export const { PORT, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = envSchema.parse(
  process.env,
)
