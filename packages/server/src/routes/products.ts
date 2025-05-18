import { DatabaseError, ForeignKeyError } from "@server/errors/databaseError"
import { NotFoundError } from "@server/errors/notFoundError"
import { ParameterError } from "@server/errors/parameterError"
import { ProductsModel } from "@server/models/products.model"
import { productsContract } from "@shared/contracts/products"
import { initServer } from "@ts-rest/express"

const s = initServer()
const productsModel = new ProductsModel()

export const productsRouter = s.router(productsContract, {
  getAll: async () => {
    const result = await productsModel.getAll()

    if (result.isErr()) {
      return {
        status: 500,
        body: {
          code: "INTERNAL_ERROR",
          message: "There was an error getting the products",
        },
      }
    }

    const { value: products } = result

    return {
      status: 200,
      body: {
        products,
      },
    }
  },
  getById: async ({ req }) => {
    const id = req.params.id

    const result = await productsModel.getById({ id })

    if (result.isErr()) {
      const { error } = result

      if (error instanceof DatabaseError) {
        return {
          status: 500,
          body: {
            code: "INTERNAL_ERROR",
            message: "There was an error getting a specific product",
          },
        }
      }

      return {
        status: 404,
        body: {
          code: "NOT_FOUND",
          message: "The product was not found",
        },
      }
    }

    const { value: products } = result

    return {
      status: 200,
      body: {
        products,
      },
    }
  },
  post: async ({ req: { body } }) => {
    const { name, price, categories } = body

    const result = await productsModel.post({ name, price, categories })

    if (result.isErr()) {
      const { error } = result
      if (error instanceof ForeignKeyError) {
        return {
          status: 500,
          body: {
            code: "FOREIGN_KEY_ERROR",
            message:
              "Failed to insert the product. Please ensure that the provided category IDs are valid and exists.",
          },
        }
      }
      return {
        status: 500,
        body: {
          code: "INTERNAL_ERROR",
          message: "There was an error getting a specific product",
        },
      }
    }
    const { value: products } = result

    return {
      status: 201,
      body: {
        products,
      },
    }
  },
  patch: async ({ req: { params, body } }) => {
    const { id } = params
    const { name, price, categories } = body

    const result = await productsModel.patch({
      id,
      name,
      price,
      categories,
    })

    if (result.isErr()) {
      const { error } = result
      if (error instanceof ParameterError) {
        return {
          status: 400,
          body: {
            code: "PARAMETER_ERROR",
            message:
              "At least one of 'name', 'price' or 'categories' must be provided to update the product.",
          },
        }
      }
      if (error instanceof NotFoundError) {
        return {
          status: 404,
          body: {
            code: "NOT_FOUND",
            message: "The product to modify was not found",
          },
        }
      }
      if (error instanceof ForeignKeyError) {
        return {
          status: 500,
          body: {
            code: "FOREIGN_KEY_ERROR",
            message:
              "Failed to insert the product. Please ensure that the provided category IDs are valid and exists.",
          },
        }
      }

      return {
        status: 500,
        body: {
          code: "INTERNAL_ERROR",
          message: "There was an error updating the product",
        },
      }
    }

    const { value: products } = result
    return {
      status: 200,
      body: {
        products,
      },
    }
  },
  delete: async ({ req: { params } }) => {
    const { id } = params

    const result = await productsModel.delete({ id })

    if (result.isErr()) {
      return {
        status: 500,
        body: {
          code: "INTERNAL_ERROR",
          message: "There was an error updating the category",
        },
      }
    }

    const { value: products } = result

    return {
      status: 200,
      body: {
        products,
      },
    }
  },
})
