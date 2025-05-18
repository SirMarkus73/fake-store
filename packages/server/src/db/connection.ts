import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "@server/lib/envConfig"

import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

const turso = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
})

export const db = drizzle(turso)
