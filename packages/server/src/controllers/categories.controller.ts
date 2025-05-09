import type { Request, Response } from "express"
import { z } from "zod"

import { DatabaseError } from "@/errors/databaseError"
import { NotFoundError } from "@/errors/notFoundError"
import { ParameterError } from "@/errors/parameterError"
import { CategoriesModel } from "@/models/categories.model"

const errorHandler = ({
  res,
  error,
  context,
}: {
  res: Response
  error: unknown
  context: "Insert" | "Select" | "Delete" | "Update"
}) => {
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

  if (error instanceof DatabaseError && context === "Delete") {
    return res.status(500).json({
      message:
        "Unable to remove the category. Please verify the details and try again, or contact support if the issue persists.",
      categories: [],
      responseCode: 500,
    })
  }

  if (error instanceof DatabaseError && context === "Update") {
    return res.status(500).json({
      message:
        "Unable to update the category. Please verify the details and try again, or contact support if the issue persists.",
      categories: [],
      responseCode: 500,
    })
  }

  if (
    error instanceof NotFoundError &&
    (context === "Insert" || context === "Select")
  ) {
    return res.status(404).json({
      message:
        "The requested category was not found. Please verify the category ID and try again.",
      categories: [],
      responseCode: 404,
    })
  }

  if (error instanceof NotFoundError && context === "Delete") {
    return res.status(404).json({
      message:
        "The category you are trying to delete does not exist. Please verify the category ID and ensure it is correct before trying again.",
      categories: [],
      responseCode: 404,
    })
  }

  if (error instanceof ParameterError && context === "Update") {
    return res.status(400).json({
      message:
        "At least one of 'name' or 'description' must be provided to update the category.",
      categories: [],
      responseCode: 400,
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

  getAll = async (_: Request, res: Response): Promise<void> => {
    const result = await this.categoriesModel.getAll()

    if (result.isErr()) {
      const { error } = result
      errorHandler({ res, error, context: "Select" })
      return
    }

    const { value: categories } = result

    res.status(200).json({
      categories,
      responseCode: 200,
    })
  }

  getById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    const parsedId = z.coerce.number().safeParse(id)

    if (!parsedId.success) {
      res.status(500).json({
        message: "Id is not a valid number or missing.",
        categories: [],
        responseCode: 500,
      })
      return
    }

    const result = await this.categoriesModel.getById({
      id: parsedId.data,
    })

    if (result.isErr()) {
      const { error } = result
      errorHandler({ res, error, context: "Select" })
      return
    }

    const { value: categories } = result

    res.status(200).json({
      categories: categories,
      responseCode: 200,
    })
  }

  post = async (req: Request, res: Response): Promise<void> => {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
    })

    const parsedBody = bodySchema.safeParse(req.body)

    if (!parsedBody.success) {
      res.status(500).json({
        message: "Name or description is not valid or missing.",
        categories: [],
        responseCode: 500,
      })
      return
    }

    const { name, description } = parsedBody.data

    const result = await this.categoriesModel.post({
      name,
      description,
    })

    if (result.isErr()) {
      const { error } = result
      errorHandler({ res, error, context: "Insert" })
      return
    }

    const { value: postedCategory } = result

    res.status(201).json({
      categories: postedCategory,
      responseCode: 201,
    })
  }

  patch = async (req: Request, res: Response): Promise<void> => {
    const parsedId = z.coerce.number().safeParse(req.params.id)

    if (!parsedId.success) {
      res.status(500).json({
        message: "Id is not a valid number or missing.",
        categories: [],
        responseCode: 500,
      })
      return
    }

    const id = parsedId.data

    const parsedBody = z
      .object({
        name: z.string().optional(),
        description: z.string().optional(),
      })
      .safeParse(req.body)

    if (!parsedBody.success) {
      res.status(500).json({
        message: "Name or description is not valid or missing.",
        categories: [],
        responseCode: 500,
      })
      return
    }

    const { name, description } = parsedBody.data

    const result = await this.categoriesModel.patch({ id, name, description })

    if (result.isErr()) {
      const { error } = result
      errorHandler({ res, error, context: "Update" })
      return
    }

    const { value: patchCategory } = result
    res.status(200).json({
      categories: patchCategory,
      responseCode: 200,
    })
  }

  delete = async (req: Request, res: Response): Promise<void> => {
    const parsedId = z.coerce.number().safeParse(req.params.id)

    if (!parsedId.success) {
      res.status(500).json({
        message: "Id is not a valid number or missing.",
        categories: [],
        responseCode: 500,
      })
      return
    }

    const id = parsedId.data

    const result = await this.categoriesModel.delete({ id })

    if (result.isErr()) {
      const { error } = result
      errorHandler({ res, error, context: "Delete" })
      return
    }

    const { value: deletedCategory } = result
    res.status(200).json({
      categories: deletedCategory,
      responseCode: 200,
    })
  }
}
