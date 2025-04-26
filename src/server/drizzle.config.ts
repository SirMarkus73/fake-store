import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from "./lib/envConfig"

import type { Config } from "drizzle-kit"

export default {
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  },
} satisfies Config
