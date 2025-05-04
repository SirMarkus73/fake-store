import { db } from "@/db/connection"
import { category, product, productCategory } from "@/db/schema"
import { DatabaseError, ForeignKeyError } from "@/errors/databaseError"
import { NotFoundError } from "@/errors/notFoundError"
import type {
  ProductWithCategory,
  ProductWithCategoryList,
} from "@/types/products"
import { LibsqlError } from "@libsql/client"
import { eq } from "drizzle-orm"
import { type Result, ResultAsync, err, ok } from "neverthrow"

interface GetByIdParams {
  id: number
}

interface InsertParams {
  name: string
  price: number
  categories?: number[]
}

interface DeleteParams {
  id: number
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

  getAll = async (): Promise<
    Result<ProductWithCategoryList[], DatabaseError>
  > => {
    const result = await ResultAsync.fromPromise(
      db
        .select({
          id: product.id,
          name: product.name,
          price: product.price,
          category: category.name,
        })
        .from(product)
        .leftJoin(productCategory, eq(product.id, productCategory.productId))
        .leftJoin(category, eq(productCategory.categoryId, category.id))
        .orderBy(product.id),
      () => new DatabaseError("Cannot get all products from database"),
    )

    if (result.isErr()) {
      const { error } = result
      return err(error)
    }

    const { value: products } = result

    return ok(await this.#parseProducts(products))
  }

  getById = async ({
    id,
  }: GetByIdParams): Promise<
    Result<ProductWithCategoryList[], DatabaseError | NotFoundError>
  > => {
    const result = await ResultAsync.fromPromise(
      db
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
        .orderBy(product.id),
      () => new DatabaseError(`Cannot get the product with id ${id}`),
    )

    if (result.isErr()) {
      const { error } = result
      return err(error)
    }

    const { value: selectedProduct } = result

    if (selectedProduct.length === 0) {
      return err(
        new NotFoundError(`Product with id ${id} not found in database`),
      )
    }

    return ok(await this.#parseProducts(selectedProduct))
  }

  insert = async ({
    name,
    price,
    categories,
  }: InsertParams): Promise<
    Result<ProductWithCategoryList[], DatabaseError | ForeignKeyError>
  > => {
    const result = await ResultAsync.fromPromise(
      db.transaction(async (tx) => {
        // Not managing errors because will be handled by `ResultAsync.fromPromise`
        const productInserted = await tx
          .insert(product)
          .values({ name, price })
          .returning()

        const productInsertedId = productInserted[0].id

        if (categories !== undefined && categories.length > 0) {
          const insertCategories = categories.map((category) => ({
            categoryId: category,
            productId: productInsertedId,
          }))

          // This will trow a rollback error if fails
          await tx.insert(productCategory).values(insertCategories)
        }

        return productInserted
      }),
      (error) => {
        if (
          error instanceof LibsqlError &&
          error.code === "SQLITE_CONSTRAINT"
        ) {
          return new ForeignKeyError(
            "Failed to insert product categories due to foreign key constraint violation",
          )
        }

        return new DatabaseError(
          `Cannot insert product with name: ${name}, price ${price}`,
        )
      },
    )

    if (result.isErr()) {
      const { error } = result
      return err(error)
    }

    const { value: insertedProduct } = result
    return this.getById({ id: insertedProduct[0].id })
  }

  delete = async ({
    id,
  }: DeleteParams): Promise<
    Result<ProductWithCategoryList[], DatabaseError>
  > => {
    const productToDelete = await this.getById({ id })

    if (productToDelete.isErr()) productToDelete

    const productDelete = await ResultAsync.fromPromise(
      db.delete(product).where(eq(product.id, id)),
      () => new DatabaseError(`couldn't delete the product with id: ${id}`),
    )

    if (productDelete.isErr()) {
      const { error } = productDelete
      return err(error)
    }

    return productToDelete
  }
}
