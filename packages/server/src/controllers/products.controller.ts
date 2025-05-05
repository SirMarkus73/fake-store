import { DatabaseError, ForeignKeyError } from "@/errors/databaseError"
import { NotFoundError } from "@/errors/notFoundError"
import { ProductsModel } from "@/models/products.model"
import type { Request, Response } from "express"
import { z } from "zod"

const errorHandler = ({
  res,
  error,
  context,
}: {
  res: Response
  error: unknown
  context: "Insert" | "Select" | "Delete"
}) => {
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

  if (error instanceof DatabaseError && context === "Delete") {
    return res.status(500).json({
      message:
        "Unable to remove the category. Please verify the details and try again, or contact support if the issue persists.",
      categories: [],
      responseCode: 500,
    })
  }

  if (error instanceof ForeignKeyError && context === "Insert") {
    return res.status(400).json({
      message:
        "Failed to insert the product. Please ensure that the provided category IDs are valid and exists.",
      products: [],
      responseCode: 400,
    })
  }

  if (
    error instanceof NotFoundError &&
    (context === "Insert" || context === "Select")
  ) {
    return res.status(404).json({
      message:
        "The requested product was not found. Please verify the product ID and try again.",
      products: [],
      responseCode: 404,
    })
  }

  if (error instanceof NotFoundError && context === "Delete") {
    return res.status(404).json({
      message:
        "The product you are trying to delete does not exist. Please verify the category ID and ensure it is correct before trying again.",
      categories: [],
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

  getAll = async (_: Request, res: Response): Promise<void> => {
    const result = await this.productsModel.getAll()

    if (result.isErr()) {
      const { error } = result
      errorHandler({ res, error, context: "Select" })
      return
    }

    const { value: products } = result

    res.status(200).json({
      products,
      responseCode: 200,
    })
  }

  getById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id

    const parsedId = z.coerce.number().safeParse(id)

    if (!parsedId.success) {
      res.status(400).json({
        message: "Invalid request body. Ensure 'id' is a number.",
        products: [],
        responseCode: 400,
      })
      return
    }

    const result = await this.productsModel.getById({
      id: parsedId.data,
    })

    if (result.isErr()) {
      const { error } = result
      errorHandler({ res, error, context: "Insert" })
      return
    }

    const { value: products } = result

    res.status(200).json({
      products,
      response: 200,
    })
  }

  post = async (req: Request, res: Response): Promise<void> => {
    const bodySchema = z.object({
      name: z.string(),
      price: z.number(),
      categories: z.array(z.number()).optional(),
    })

    const parsedBody = bodySchema.safeParse(req.body)

    if (!parsedBody.success) {
      res.status(400).json({
        message:
          "Invalid request body. Ensure 'name' is a string, 'price' is a number, and 'categories' (if provided) is an array of numbers.",
        products: [],
        responseCode: 400,
      })
      return
    }

    const { name, price, categories } = parsedBody.data

    const result = await this.productsModel.insert({ name, price, categories })

    if (result.isErr()) {
      const { error } = result
      errorHandler({ res, error, context: "Insert" })
      return
    }

    const { value: postedProduct } = result

    res.status(201).json({
      products: postedProduct,
      responseCode: 201,
    })
  }

  delete = async (req: Request, res: Response): Promise<void> => {
    const parsedId = z.coerce.number().safeParse(req.params.id)

    if (!parsedId.success) {
      res.status(500).json({
        message: "Id is not a valid number or missing.",
        products: [],
        responseCode: 500,
      })
      return
    }

    const id = parsedId.data

    const result = await this.productsModel.delete({ id })

    if (result.isErr()) {
      const { error } = result
      errorHandler({ res, error, context: "Delete" })
      return
    }

    const { value: deletedProduct } = result
    res.status(200).json({
      products: deletedProduct,
      responseCode: 200,
    })
  }
}
