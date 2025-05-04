import type { Request, Response } from "express"
import { z } from "zod"

import { DatabaseError } from "@/errors/databaseError"
import { NotFoundError } from "@/errors/notFoundError"
import { CategoriesModel } from "@/models/categories.model"

const errorHandler = ({
  res,
  error,
  context,
}: { res: Response; error: unknown; context: "Insert" | "Select" }) => {
  console.error(error)

  if (error instanceof DatabaseError && context === "Select") {
    return res.status(500).json({
      message:
        "Failed to retrieve the categories. Please try again later or contact support if the issue persists.",
      categories: [],
      responseCode: 500,
    })
  }

  if (error instanceof DatabaseError && context === "Insert") {
    return res.status(500).json({
      message:
        "Unable to add the category. A category with the same name might already exist. Please verify the details and try again, or contact support if the issue persists.",
      categories: [],
      responseCode: 500,
    })
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      message:
        "The requested category was not found. Please verify the category ID and try again.",
      categories: [],
      responseCode: 404,
    })
  }

  return res.status(500).json({
    message:
      "An unexpected error occurred while processing your request. Please try again later or contact support if the issue persists.",
    categories: [],
    responseCode: 500,
  })
}

export class CategoriesController {
  categoriesModel = new CategoriesModel()

  getAll = async (_: Request, res: Response): Promise<Response> => {
    try {
      const categories = await this.categoriesModel.getAll()
      return res.status(200).json({
        categories,
        responseCode: 200,
      })
    } catch (error) {
      return errorHandler({ res, error, context: "Select" })
    }
  }

  getById = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id

    const parsedId = z.coerce.number().safeParse(id)

    if (!parsedId.success) {
      return res.status(500).json({
        message: "Id is not a valid number or missing.",
        categories: [],
        responseCode: 500,
      })
    }

    try {
      const categories = await this.categoriesModel.getById({
        id: parsedId.data,
      })
      return res.status(200).json({
        categories: [categories],
        responseCode: 200,
      })
    } catch (error) {
      return errorHandler({ res, error, context: "Select" })
    }
  }

  post = async (req: Request, res: Response): Promise<Response> => {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
    })

    const parsedBody = bodySchema.safeParse(req.body)

    if (!parsedBody.success) {
      return res.status(500).json({
        message: "Name or description is not valid or missing.",
        categories: [],
        responseCode: 500,
      })
    }

    const { name, description } = parsedBody.data

    try {
      const postedCategory = await this.categoriesModel.create({
        name,
        description,
      })

      return res.status(201).json({
        categories: postedCategory,
        responseCode: 201,
      })
    } catch (error) {
      return errorHandler({ res, error, context: "Insert" })
    }
  }
}
