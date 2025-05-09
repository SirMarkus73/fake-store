import { db } from "@/db/connection"
import { category } from "@/db/schema"
import { DatabaseError } from "@/errors/databaseError"
import { NotFoundError } from "@/errors/notFoundError"
import { ParameterError } from "@/errors/parameterError"
import type {
  DeleteParams,
  DeleteResult,
  GetAllResult,
  GetByIdParams,
  GetByIdResult,
  PatchParams,
  PatchResult,
  PostParams,
  PostResult,
} from "@/types/categories.model"
import type { Category } from "@/types/category"
import { eq } from "drizzle-orm"
import { ResultAsync, err, ok } from "neverthrow"

export class CategoriesModel {
  getAll = async (): GetAllResult => {
    const result = await ResultAsync.fromPromise(
      db.select().from(category),
      () => new DatabaseError("Cannot get all categories from database"),
    )

    if (result.isErr()) {
      const { error } = result
      return err(error)
    }

    const { value } = result
    return ok(value)
  }

  getById = async ({ id }: GetByIdParams): GetByIdResult => {
    const result = await ResultAsync.fromPromise(
      db.select().from(category).where(eq(category.id, id)),
      () =>
        new DatabaseError("Cannot get the requested category from database."),
    )

    if (result.isErr()) {
      const { error } = result
      return err(error)
    }

    const { value: categories } = result

    if (categories.length === 0) {
      return err(new NotFoundError(`Category with id ${id} not found.`))
    }

    return ok(categories)
  }

  post = async ({ name, description }: PostParams): PostResult => {
    const result = await ResultAsync.fromPromise(
      db.insert(category).values({ name, description }).returning(),
      () =>
        new DatabaseError(
          `Unable to create a category with name: ${name}, description: ${description}`,
        ),
    )

    if (result.isErr()) {
      const { error } = result
      return err(error)
    }

    const { value } = result
    return ok(value)
  }

  patch = async ({ id, name, description }: PatchParams): PatchResult => {
    const updateData: Partial<Category> = {}

    if (name !== undefined) {
      updateData.name = name
    }

    if (description !== undefined) {
      updateData.description = description
    }

    if (Object.keys(updateData).length === 0) {
      return err(
        new ParameterError(
          "At least one of 'name' or 'description' must be provided to update the category.",
        ),
      )
    }

    const result = await ResultAsync.fromPromise(
      db
        .update(category)
        .set(updateData)
        .where(eq(category.id, id))
        .returning(),
      () => new DatabaseError("Error updating the category"),
    )

    return result
  }

  delete = async ({ id }: DeleteParams): DeleteResult => {
    const existsPerviously = await this.getById({ id })

    if (existsPerviously.isErr()) return existsPerviously

    const result = await ResultAsync.fromPromise(
      db.delete(category).where(eq(category.id, id)).returning(),
      () => new DatabaseError(`couldn't delete the category with id: ${id}`),
    )

    return result
  }
}
