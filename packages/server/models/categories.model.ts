import { db } from "@/db/connection"
import { category } from "@/db/schema"
import { DatabaseError } from "@/errors/databaseError"
import { NotFoundError } from "@/errors/notFoundError"
import type { Category } from "@/types/category"
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
    try {
      return await db.select().from(category)
    } catch {
      throw new DatabaseError("Cannot get all categories from database")
    }
  }

  getById = async ({ id }: GetByIdParams) => {
    let categories: Category[]

    try {
      categories = await db.select().from(category).where(eq(category.id, id))
    } catch {
      throw new DatabaseError("Cannot the requested category from database.")
    }

    if (categories.length === 0) {
      throw new NotFoundError(`Category with id ${id} not found.`)
    }

    return categories[0]
  }

  create = async ({ name, description }: CreateParams) => {
    try {
      return await db.insert(category).values({ name, description }).returning()
    } catch {
      throw new DatabaseError(
        `Unable to create a category with name: ${name}, description: ${description}`,
      )
    }
  }
}
