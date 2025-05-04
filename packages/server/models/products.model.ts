import { db } from "@/db/connection"
import { category, product, productCategory } from "@/db/schema"
import { DatabaseError, ForeignKeyError } from "@/errors/databaseError"
import { NotFoundError } from "@/errors/notFoundError"
import type {
  BaseProduct,
  ProductWithCategory,
  ProductWithCategoryList,
} from "@/types/products"
import { DrizzleError, eq } from "drizzle-orm"

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
    try {
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
    } catch {
      throw new DatabaseError("Cannot get all products from database")
    }
  }

  getById = async ({
    id,
  }: GetByIdParams): Promise<ProductWithCategoryList[]> => {
    let selectedProduct: ProductWithCategory[]

    try {
      selectedProduct = await db
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
    } catch {
      throw new DatabaseError(`Cannot get the product with id ${id}`)
    }
    if (selectedProduct.length === 0) {
      throw new NotFoundError(`Product with id ${id} not found in database`)
    }

    return this.#parseProducts(selectedProduct)
  }

  insert = async ({
    name,
    price,
    categories,
  }: InsertParams): Promise<ProductWithCategoryList[]> => {
    let insertedProduct: BaseProduct[]
    try {
      insertedProduct = await db.transaction(async (tx) => {
        let productInserted: BaseProduct[]

        try {
          productInserted = await tx
            .insert(product)
            .values({ name, price })
            .returning()
        } catch {
          throw new DatabaseError(
            `Cannot insert product with name: ${name}, price ${price}`,
          )
        }

        const productInsertedId = productInserted[0].id

        if (categories !== undefined && categories.length > 0) {
          const insertCategories = categories?.map((category) => ({
            categoryId: category,
            productId: productInsertedId,
          }))

          try {
            await tx.insert(productCategory).values(insertCategories)
          } catch {
            tx.rollback()
          }
        }

        return productInserted
      })
    } catch (error) {
      if (error instanceof DrizzleError && error.message === "Rollback") {
        throw new ForeignKeyError(
          "Failed to insert product categories due to foreign key constraint violation",
        )
      }

      throw error
    }

    return this.getById({ id: insertedProduct[0].id })
  }
}
