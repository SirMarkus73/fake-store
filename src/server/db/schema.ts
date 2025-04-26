import { sql } from "drizzle-orm"
import {
  text,
  sqliteTable,
  integer,
  numeric,
  check,
} from "drizzle-orm/sqlite-core"

export const product = sqliteTable(
  "product",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text(),
    price: numeric(),
  },
  (table) => [check("price_check", sql`${table.price} > 0`)],
)
