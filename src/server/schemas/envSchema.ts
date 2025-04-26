import { z } from "zod"

export const envSchema = z.object({
  PORT: z.coerce
    .number({ description: "Port where the server will listen" })
    .default(3000),
})
