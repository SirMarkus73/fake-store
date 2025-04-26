import { product } from "@/db/schema"
import { db } from "@/db/connection"
import { eq } from "drizzle-orm"

export class ProductsModel {
  getAll = async () => {
    const products = await db.select().from(product)
    return products
  }

  getById = async (id: number) => {
    const selectedProduct = await db
      .select()
      .from(product)
      .where(eq(product.id, id))

    if (selectedProduct.length === 0) {
      throw new Error("Product not found")
    }

    return selectedProduct[0]
  }

  insert = async (name: string, price: number) => {
    const productInserted = await db
      .insert(product)
      .values({ name, price })
      .returning()

    return productInserted
  }
}
