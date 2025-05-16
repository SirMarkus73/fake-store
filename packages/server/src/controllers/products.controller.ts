import { DatabaseError, ForeignKeyError } from "@/errors/databaseError"
import { NotFoundError } from "@/errors/notFoundError"
import { ParameterError } from "@/errors/parameterError"
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
  context: "Insert" | "Select" | "Delete" | "Update"
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

  if (error instanceof DatabaseError && context === "Update") {
    return res.status(500).json({
      message:
        "Unable to update the product. Please verify the details and try again, or contact support if the issue persists.",
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

  if (error instanceof ParameterError && context === "Update") {
    return res.status(400).json({
      message:
        "At least one of 'name', 'price' or 'categories' must be provided to update the category.",
      categories: [],
      responseCode: 400,
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

  delete = async (req: Request, res: Response): Promise<void> => {}
}
