import { initContract } from "@ts-rest/core"
import { z } from "zod"

const c = initContract()

export const categoriesContract = c.router({
  getAll: {
    method: "GET",
    path: "/api/categories",
    responses: {
      200: z.object({
        categories: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            description: z.string(),
          }),
        ),
      }),
      500: z.object({
        code: z.string(),
        message: z.string(),
      }),
    },
  },
  getById: {
    method: "GET",
    path: "/api/categories/:id",
    pathParams: z.object({ id: z.coerce.number() }),
    responses: {
      200: z.object({
        categories: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            description: z.string(),
          }),
        ),
      }),
      500: z.object({
        code: z.string(),
        message: z.string(),
      }),
      404: z.object({
        code: z.string(),
        message: z.string(),
      }),
    },
  },
  post: {
    method: "POST",
    path: "/api/categories",
    body: z.object({
      name: z.string(),
      description: z.string(),
    }),
    responses: {
      201: z.object({
        categories: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            description: z.string(),
          }),
        ),
      }),
      500: z.object({
        code: z.string(),
        message: z.string(),
      }),
    },
  },
  patch: {
    method: "PATCH",
    path: "/api/categories/:id",
    pathParams: z.object({ id: z.coerce.number() }),
    body: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
    }),
    responses: {
      200: z.object({
        categories: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            description: z.string(),
          }),
        ),
      }),
      500: z.object({
        code: z.string(),
        message: z.string(),
      }),
      400: z.object({
        code: z.string(),
        message: z.string(),
      }),
      404: z.object({
        code: z.string(),
        message: z.string(),
      }),
    },
  },
  delete: {
    method: "DELETE",
    path: "/api/categories/:id",
    pathParams: z.object({ id: z.coerce.number() }),
    responses: {
      200: z.object({
        categories: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            description: z.string(),
          }),
        ),
      }),
      500: z.object({
        code: z.string(),
        message: z.string(),
      }),
      404: z.object({
        code: z.string(),
        message: z.string(),
      }),
    },
  },
})
