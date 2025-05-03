import { db } from "@/db/connection"
import { product, productCategory, category } from "@/db/schema"
import type {
  ProductWithCategory,
  ProductWithCategoryList,
} from "@/types/products"
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
  #parseProducts = async (
    products: ProductWithCategory[],
  ): Promise<ProductWithCategoryList[]> => {
    const parsedProducts = products.reduce((accumulator, current) => {
      const existingProduct = accumulator.find((prod) => prod.id === current.id)

      if (existingProduct && current.category) {
        existingProduct.categories.push(current.category)
      } else {
        accumulator.push({
          id: current.id,
          name: current.name,
          price: current.price,
          categories: current.category ? [current.category] : [],
        })
      }

      return accumulator
    }, [] as ProductWithCategoryList[])

    return parsedProducts
  }

  getAll = async (): Promise<ProductWithCategoryList[]> => {
    const products = await db
      .select({
        id: product.id,
        name: product.name,
        price: product.price,
        category: category.name,
      })
      .from(product)
      .leftJoin(productCategory, eq(product.id, productCategory.productId))
      .leftJoin(category, eq(productCategory.categoryId, category.id))
      .orderBy(product.id)

    return this.#parseProducts(products)
  }

  getById = async ({
    id,
  }: GetByIdParams): Promise<ProductWithCategoryList[]> => {
    const selectedProduct = await db
      .select({
        id: product.id,
        name: product.name,
        price: product.price,
        category: category.name,
      })
      .from(product)
      .where(eq(product.id, id))
      .leftJoin(productCategory, eq(product.id, productCategory.productId))
      .leftJoin(category, eq(productCategory.categoryId, category.id))
      .orderBy(product.id)

    if (selectedProduct.length === 0) {
      throw new Error("Product not found")
    }

    return this.#parseProducts(selectedProduct)
  }

  insert = async ({
    name,
    price,
    categories,
  }: InsertParams): Promise<ProductWithCategoryList[]> => {
    const productInserted = await db
      .insert(product)
      .values({ name, price })
      .returning()

    const productInsertedId = productInserted[0].id

    if (categories !== undefined && categories.length > 0) {
      const insertCategories = categories?.map((category) => ({
        categoryId: category,
        productId: productInsertedId,
      }))

      try {
        await db.insert(productCategory).values(insertCategories)
      } catch {
        throw new Error(
          `Cannot insert product category relation with ${categories} `,
        )
      }
    }

    return this.getById({ id: productInsertedId })
  }
}
