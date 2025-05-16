import { DatabaseError } from "@/errors/databaseError"
import { NotFoundError } from "@/errors/notFoundError"
import { ParameterError } from "@/errors/parameterError"
import { CategoriesModel } from "@/models/categories.model"
import { categoriesContract } from "@common/contracts/categories"
import { initServer } from "@ts-rest/express"

const s = initServer()
const categoriesModel = new CategoriesModel()

export const categoriesRouter = s.router(categoriesContract, {
  getAll: async () => {
    const result = await categoriesModel.getAll()

    if (result.isErr()) {
      return {
        status: 500,
        body: {
          code: "INTERNAL_ERROR",
          message: "There was an error getting the categories",
        },
      }
    }

    const { value: categories } = result

    return {
      status: 200,
      body: {
        categories,
      },
    }
  },
  getById: async ({ req }) => {
    const id = req.params.id

    const result = await categoriesModel.getById({ id })

    if (result.isErr()) {
      const { error } = result

      if (error instanceof DatabaseError) {
        return {
          status: 500,
          body: {
            code: "INTERNAL_ERROR",
            message: "There was an error getting a specific category",
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

    const { value: categories } = result

    return {
      status: 200,
      body: {
        categories,
      },
    }
  },
  post: async ({ req: { body } }) => {
    const { name, description } = body

    const result = await categoriesModel.post({
      name,
      description,
    })

    if (result.isErr()) {
      return {
        status: 500,
        body: {
          code: "INTERNAL_ERROR",
          message: "There was an error creating the category",
        },
      }
    }

    const { value: categories } = result

    return {
      status: 201,
      body: {
        categories,
      },
    }
  },
  patch: async ({ req: { params, body } }) => {
    const { id } = params
    const { name, description } = body

    const result = await categoriesModel.patch({ id, name, description })

    if (result.isErr()) {
      const { error } = result
      if (error instanceof ParameterError) {
        return {
          status: 400,
          body: {
            code: "PARAMETER_ERROR",
            message:
              "At least one of 'name' or 'description' must be provided to update the category.",
          },
        }
      }
      return {
        status: 500,
        body: {
          code: "INTERNAL_ERROR",
          message: "There was an error updating the category",
        },
      }
    }

    const { value: categories } = result

    return {
      status: 200,
      body: {
        categories,
      },
    }
  },
  delete: async ({ req: { params } }) => {
    const { id } = params

    const result = await categoriesModel.delete({ id })

    if (result.isErr()) {
      const { error } = result
      if (error instanceof NotFoundError) {
        return {
          status: 404,
          body: {
            code: "NOT_FOUND",
            message: "The category you are trying to delete does not exist.",
          },
        }
      }
      return {
        status: 500,
        body: {
          code: "INTERNAL_ERROR",
          message: "There was an internal error trying to delete the category",
        },
      }
    }

    const { value: categories } = result

    return {
      status: 200,
      body: {
        categories,
      },
    }
  },
})
