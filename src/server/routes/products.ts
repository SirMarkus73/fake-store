import { Router } from "express"
import { z } from "zod"

import { ProductsController } from "@controllers/products.controller"

export const productsRouter = Router()

const productsController = new ProductsController()

productsRouter.get("/", (_, res) => {
  res.json({
    products: productsController.getAll(),
    responseCode: 200,
  })
})

productsRouter.get("/:id", (req, res) => {
  const id = req.params.id
  const parsedId = z.number().safeParse(id)

  if (!parsedId.success) {
    res.status(500).json({
      message: "Id is not a valid number.",
      products: [],
      responseCode: 500,
    })
    return
  }

  try {
    const product = productsController.getById(parsedId.data)

    res.json({
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
})

productsRouter.post("/", (req, res) => {
  const name = req.body.name
  const price = req.body.price

  const parsedName = z.string().safeParse(name)
  const parsedPrice = z.number().safeParse(price)

  if (!parsedName.success) {
    res.status(500).json({
      message: "Name is not valid or missing.",
      products: [],
      responseCode: 500,
    })
    return
  }

  if (!parsedPrice.success) {
    res.status(500).json({
      message: "Price is not valid or missing.",
      products: [],
      responseCode: 500,
    })
    return
  }

  const postedProduct = productsController.post(
    parsedName.data,
    parsedPrice.data,
  )

  res.status(201).json({
    products: [postedProduct],
    responseCode: 201,
  })
})
