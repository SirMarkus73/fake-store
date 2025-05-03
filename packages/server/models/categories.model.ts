import { db } from "@/db/connection"
import { category } from "@/db/schema"
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
    const categories = await db.select().from(category)
    return categories
  }

  getById = async ({ id }: GetByIdParams) => {
    const categories = await db
      .select()
      .from(category)
      .where(eq(category.id, id))

    if (categories.length === 0) {
      throw new Error("Category not found")
    }

    return categories[0]
  }

  create = async ({ name, description }: CreateParams) => {
    const categoryCreated = await db
      .insert(category)
      .values({ name, description })
      .returning()

    return categoryCreated
  }
}
