import { DatabaseError, ForeignKeyError } from "@/errors/databaseError"
import { NotFoundError } from "@/errors/notFoundError"
import { ProductsModel } from "@models/products.model"
import type { Request, Response } from "express"
import { z } from "zod"

const errorHandler = ({
  res,
  error,
  context,
}: { res: Response; error: Error; context: "Insert" | "Select" }) => {
  console.error(error)

  if (error instanceof DatabaseError && context === "Select") {
    return res.status(500).json({
      message:
        "Failed to retrieve the products. Please try again later or contact support if the issue persists.",
      products: [],
      responseCode: 500,
    })
  }

  if (error instanceof DatabaseError && context === "Insert") {
    if (context === "Insert") {
      return res.status(500).json({
        message:
          "Failed to insert the product. Please try again later or contact support if the issue persists.",
        products: [],
        responseCode: 500,
      })
    }
  }

  if (error instanceof ForeignKeyError && context === "Insert") {
    return res.status(400).json({
      message:
        "Failed to insert the product. Please ensure that the provided category IDs are valid and exists.",
      products: [],
      responseCode: 400,
    })
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      message:
        "The requested product was not found. Please verify the product ID and try again.",
      products: [],
      responseCode: 404,
    })
  }

  return res.status(500).json({
    message:
      "An unexpected error occurred while processing your request. Please try again later or contact support if the issue persists.",
    products: [],
    responseCode: 500,
  })
}

export class ProductsController {
  productsModel = new ProductsModel()

  getAll = async (_: Request, res: Response): Promise<Response> => {
    try {
      const products = await this.productsModel.getAll()

      return res.status(200).json({
        products,
        responseCode: 200,
      })
    } catch (error) {
      if (error instanceof Error) {
        return errorHandler({ res, error, context: "Select" })
      }

      return errorHandler({ res, error: new Error(), context: "Select" })
    }
  }

  getById = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id

    const parsedId = z.coerce.number().safeParse(id)

    if (!parsedId.success) {
      return res.status(400).json({
        message: "Invalid request body. Ensure 'id' is a number.",
        products: [],
        responseCode: 400,
      })
    }

    try {
      const product = await this.productsModel.getById({ id: parsedId.data })

      return res.status(200).json({
        products: [product],
        response: 200,
      })
    } catch (error) {
      if (error instanceof Error) {
        return errorHandler({ res, error, context: "Select" })
      }

      return errorHandler({ res, error: new Error(), context: "Insert" })
    }
  }

  post = async (req: Request, res: Response): Promise<Response> => {
    const bodySchema = z.object({
      name: z.string(),
      price: z.number(),
      categories: z.array(z.number()).optional(),
    })

    const parsedBody = bodySchema.safeParse(req.body)

    if (!parsedBody.success) {
      return res.status(400).json({
        message:
          "Invalid request body. Ensure 'name' is a string, 'price' is a number, and 'categories' (if provided) is an array of numbers.",
        products: [],
        responseCode: 400,
      })
    }

    const { name, price, categories } = parsedBody.data

    try {
      const postedProduct = await this.productsModel.insert({
        name,
        price,
        categories,
      })

      return res.status(201).json({
        products: postedProduct,
        responseCode: 201,
      })
    } catch (error) {
      if (error instanceof Error) {
        return errorHandler({ res, error, context: "Insert" })
      }

      return errorHandler({ res, error: new Error(), context: "Insert" })
    }
  }
}
