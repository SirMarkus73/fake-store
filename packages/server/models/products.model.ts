import { db } from "@/db/connection"
import { product, productCategory } from "@/db/schema"
import type { ProductWithCategories } from "@/types/products"
import { eq } from "drizzle-orm"

interface GetByIdParams {
  id: number
}

interface InsertParams {
  name: string
  price: number
  categories?: number[]
}
export class ProductsModel {
  #getProductCategories = async (productId: number) => {
    const categoriesIdSelect = await db
      .select()
      .from(productCategory)
      .where(eq(productCategory.productId, productId))

    return categoriesIdSelect.map((val) => val.categoryId)
  }

  getAll = async () => {
    const products = await db.select().from(product)

    const productsWithCategoriesPromise = products.map(async (product) => {
      const categoriesId = await this.#getProductCategories(product.id)

      const productWithCategory: ProductWithCategories = {
        ...product,
        categories: categoriesId,
      }

      return productWithCategory
    })

    const productsWithCategories = await Promise.all(
      productsWithCategoriesPromise,
    )

    return productsWithCategories
  }

  getById = async ({ id }: GetByIdParams) => {
    const selectedProduct = await db
      .select()
      .from(product)
      .where(eq(product.id, id))

    if (selectedProduct.length === 0) {
      throw new Error("Product not found")
    }

    const categoriesId = await this.#getProductCategories(id)

    const selectedProductWithCategories: ProductWithCategories = {
      ...selectedProduct[0],
      categories: categoriesId,
    }

    return selectedProductWithCategories
  }

  insert = async ({ name, price, categories }: InsertParams) => {
    const productInserted = await db
      .insert(product)
      .values({ name, price })
      .returning()

    const productWithCategories: ProductWithCategories = {
      ...productInserted[0],
      categories: [],
    }

    if (categories !== undefined) {
      const values = categories.map((category) => ({
        categoryId: category,
        productId: productInserted[0].id,
      }))

      try {
        await db.insert(productCategory).values(values)
      } catch {
        throw new Error(
          `Cannot insert product category relation with ${categories} `,
        )
      }

      productWithCategories.categories = categories
    }

    return [productWithCategories]
  }
}
