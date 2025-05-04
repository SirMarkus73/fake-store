import { db } from "@/db/connection"
import { category } from "@/db/schema"
import { DatabaseError } from "@/errors/databaseError"
import { NotFoundError } from "@/errors/notFoundError"
import { tryCatch } from "@/lib/tryCatch"
import { eq } from "drizzle-orm"

interface GetByIdParams {
  id: number
}

interface CreateParams {
  name: string
  description: string
}

export class CategoriesModel {
  getAll = async () => {
    const { data, error } = await tryCatch(db.select().from(category))
    if (error) {
      throw new DatabaseError("Cannot get all categories from database")
    }

    return data
  }

  getById = async ({ id }: GetByIdParams) => {
    const { data: categories, error } = await tryCatch(
      db.select().from(category).where(eq(category.id, id)),
    )

    if (error) {
      throw new DatabaseError("Cannot the requested category from database.")
    }

    if (categories.length === 0) {
      throw new NotFoundError(`Category with id ${id} not found.`)
    }

    return categories[0]
  }

  create = async ({ name, description }: CreateParams) => {
    const { data, error } = await tryCatch(
      db.insert(category).values({ name, description }).returning(),
    )

    if (error) {
      throw new DatabaseError(
        `Unable to create a category with name: ${name}, description: ${description}`,
      )
    }

    return data
  }
}
