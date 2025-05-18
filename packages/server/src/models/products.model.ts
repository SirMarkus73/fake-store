import { LibsqlError } from "@libsql/client"
import { db } from "@server/db/connection"
import { category, product, productCategory } from "@server/db/schema"
import { DatabaseError, ForeignKeyError } from "@server/errors/databaseError"
import { NotFoundError } from "@server/errors/notFoundError"
import { ParameterError } from "@server/errors/parameterError"
import type {
  DeleteParams,
  DeleteResult,
  GetAllResult,
  GetByIdParams,
  GetByIdResult,
  ParseProductsParams,
  ParseProductsResult,
  PatchParams,
  PatchResult,
  PostParams,
  PostResult,
} from "@server/types/products.model"
import type {
  BaseProduct,
  ProductWithCategoryList,
} from "@shared/types/products"
import { eq } from "drizzle-orm"
import { ResultAsync, err, ok } from "neverthrow"

export class ProductsModel {
  #parseProducts = async ({
    products,
  }: ParseProductsParams): ParseProductsResult => {
    const parsedProducts = products.reduce((accumulator, current) => {
      const existingProduct = accumulator.find(
        (prod: ProductWithCategoryList) => prod.id === current.id,
      )

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

  getAll = async (): GetAllResult => {
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

    return ok(await this.#parseProducts({ products }))
  }

  getById = async ({ id }: GetByIdParams): GetByIdResult => {
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

    return ok(await this.#parseProducts({ products: selectedProduct }))
  }

  post = async ({ name, price, categories }: PostParams): PostResult => {
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

  patch = async ({ id, categories, name, price }: PatchParams): PatchResult => {
    const updateParams: Partial<BaseProduct> = {}

    if (name !== undefined) updateParams.name = name
    if (price !== undefined) updateParams.price = price

    if (Object.keys(updateParams).length === 0 && categories === undefined) {
      return err(
        new ParameterError(
          "At least one of 'name', 'price' or 'categories' must be provided to update the product.",
        ),
      )
    }

    if (Object.keys(updateParams).length > 0) {
      const updateResponse = await ResultAsync.fromPromise(
        db.update(product).set(updateParams).where(eq(product.id, id)),
        () => new DatabaseError("Unable to update the product"),
      )

      if (updateResponse.isErr()) {
        const { error } = updateResponse
        return err(error)
      }
    }

    if (categories) {
      const result = await ResultAsync.fromPromise(
        db.transaction(async (tx) => {
          await tx
            .delete(productCategory)
            .where(eq(productCategory.productId, id))

          const insertValues = categories.map((categoryId) => ({
            categoryId,
            productId: id,
          }))

          if (insertValues.length > 0) {
            await tx.insert(productCategory).values(insertValues)
          }
        }),
        (err) => {
          if (err instanceof LibsqlError && err.code === "SQLITE_CONSTRAINT") {
            return new ForeignKeyError(
              "Failed to update product categories due to foreign key constraint violation",
            )
          }

          return new DatabaseError(
            `Cannot update product with name: ${name}, price ${price}`,
          )
        },
      )

      if (result.isErr()) {
        const { error } = result
        return err(error)
      }
    }

    return this.getById({ id })
  }

  delete = async ({ id }: DeleteParams): DeleteResult => {
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
