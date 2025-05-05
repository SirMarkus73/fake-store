import { sql } from "drizzle-orm"
import {
  check,
  integer,
  numeric,
  primaryKey,
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

export const category = sqliteTable("category", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  description: text().notNull(),
})

export const productCategory = sqliteTable(
  "product_category",
  {
    productId: integer()
      .references(() => product.id, { onDelete: "cascade" })
      .notNull(),
    categoryId: integer()
      .references(() => category.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    primaryKey({
      name: "pk_product_category",
      columns: [table.categoryId, table.productId],
    }),
  ],
)
