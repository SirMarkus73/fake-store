import { db } from "@/db/connection"
import { category } from "@/db/schema"
import { DatabaseError } from "@/errors/databaseError"
import { NotFoundError } from "@/errors/notFoundError"
import type { Category } from "@/types/category"
import { eq } from "drizzle-orm"
import { type Result, ResultAsync, err, ok } from "neverthrow"

interface GetByIdParams {
  id: number
}

interface CreateParams {
  name: string
  description: string
}

interface DeleteParams {
  id: number
}

type ReturnType = Promise<Result<Category[], DatabaseError>>

export class CategoriesModel {
  getAll = async (): ReturnType => {
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

  getById = async ({ id }: GetByIdParams): ReturnType => {
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

  post = async ({ name, description }: CreateParams): ReturnType => {
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

  delete = async ({ id }: DeleteParams): ReturnType => {
    const existsPerviously = await this.getById({ id })

    if (existsPerviously.isErr()) return existsPerviously

    const result = await ResultAsync.fromPromise(
      db.delete(category).where(eq(category.id, id)).returning(),
      () => new DatabaseError(`couldn't delete the category with id: ${id}`),
    )

    return result
  }
}
