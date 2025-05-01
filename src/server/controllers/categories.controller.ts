import type { Request, Response } from "express"
import { z } from "zod"

import { CategoriesModel } from "@/models/categories.model"

export class CategoriesController {
  categoriesModel = new CategoriesModel()

  getAll = async (_: Request, res: Response) => {
    const categories = await this.categoriesModel.getAll()

    res.status(200).json({
      categories,
      responseCode: 200,
    })
  }

  getById = async (req: Request, res: Response) => {
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

    try {
      const categories = await this.categoriesModel.getById(parsedId.data)
      res.status(200).json({
        categories: [categories],
        responseCode: 200,
      })
      return
    } catch {
      res.status(404).json({
        message: "Category not found.",
        categories: [],
        responseCode: 404,
      })
    }
  }

  post = async (req: Request, res: Response) => {
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

    const postedCategory = await this.categoriesModel.create(name, description)

    res.status(201).json({
      categories: postedCategory,
      responseCode: 201,
    })
  }
}
