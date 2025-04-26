import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "@/lib/envConfig"

import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"

const turso = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
})

export const db = drizzle(turso)
