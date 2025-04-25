import { Router } from "express"

import { ProductsController } from "../controllers/products.controller"

export const productsRouter = Router()

const productsController = new ProductsController()

productsRouter.get("/", (_, res) => {
  res.json({
    products: productsController.getAll(),
    responseCode: 200,
  })
})

productsRouter.get("/:id", (req, res) => {
  const id = Number(req.params.id)

  console.log(id)

  if (Number.isNaN(id)) {
    res.status(500).json({
      message: "Id is not a valid number.",
      products: [],
      responseCode: 500,
    })
    return
  }

  try {
    const product = productsController.getById(id)

    res.json({
      products: [product],
      response: 200,
    })
  } catch {
    res.status(404).json({
      message: "Product not found",
      products: [],
      responseCode: 404,
    })
  }
})

productsRouter.post("/", (req, res) => {
  const name = req.body.name
  const price = req.body.price

  if (name === undefined || price === undefined) {
    res.status(500).json({
      message: "Invalid body",
      products: [],
      responseCode: 500,
    })

    return
  }

  const postedProduct = productsController.post(name, price)

  res.status(201).json({
    products: [postedProduct],
    responseCode: 201,
  })
})
