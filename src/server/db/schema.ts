import { sql } from "drizzle-orm"
import {
  check,
  integer,
  numeric,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core"

export const product = sqliteTable(
  "product",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    price: numeric({ mode: "number" }).notNull(),
  },
  (table) => [check("price_check", sql`${table.price} > 0`)],
)
