import { z } from "zod"

export const envSchema = z.object({
  PORT: z.coerce
    .number({ description: "Port where the server will listen" })
    .default(3000),
  TURSO_DATABASE_URL: z.string({ description: "URL to connect the database" }),
  TURSO_AUTH_TOKEN: z
    .string({ description: "Auth token to connect the db" })
    .optional(),
})
