import { z } from "zod"
import { ProductsModel } from "@models/products.model"
import type { Request, Response } from "express"

export class ProductsController {
  productsModel = new ProductsModel()

  getAll = (_: Request, res: Response) => {
    const products = this.productsModel.getAll()

    res.status(200).json({
      products,
      responseCode: 200,
    })
  }

  getById = (req: Request, res: Response) => {
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
      const product = this.productsModel.getById(parsedId.data)

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

  post = (req: Request, res: Response) => {
    const bodySchema = z.object({
      name: z.string(),
      price: z.number(),
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

    const { name, price } = parsedBody.data
    const postedProduct = this.productsModel.insert(name, price)

    res.status(201).json({
      products: [postedProduct],
      responseCode: 201,
    })
  }
}
