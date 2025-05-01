import { ProductsModel } from "@models/products.model"
import type { Request, Response } from "express"
import { z } from "zod"

export class ProductsController {
  productsModel = new ProductsModel()

  getAll = async (_: Request, res: Response) => {
    const products = await this.productsModel.getAll()

    res.status(200).json({
      products,
      responseCode: 200,
    })
  }

  getById = async (req: Request, res: Response) => {
    const id = req.params.id

    const parsedId = z.coerce.number().safeParse(id)

    if (!parsedId.success) {
      res.status(500).json({
        message: "Id is not a valid number or missing.",
        products: [],
        responseCode: 500,
      })
      return
    }

    try {
      const product = await this.productsModel.getById(parsedId.data)

      res.status(200).json({
        products: [product],
        response: 200,
      })
    } catch {
      res.status(404).json({
        message: "Product not found.",
        products: [],
        responseCode: 404,
      })
    }
  }

  post = async (req: Request, res: Response) => {
    const bodySchema = z.object({
      name: z.string(),
      price: z.number(),
      categories: z.array(z.number()).optional(),
    })

    const parsedBody = bodySchema.safeParse(req.body)

    if (!parsedBody.success) {
      res.status(500).json({
        message: "Name or price is not valid or missing.",
        products: [],
        responseCode: 500,
      })
      return
    }

    const { name, price, categories } = parsedBody.data
    const postedProduct = await this.productsModel.insert(
      name,
      price,
      categories,
    )

    res.status(201).json({
      products: [postedProduct],
      responseCode: 201,
    })
  }
}
