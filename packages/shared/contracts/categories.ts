import { initContract } from "@ts-rest/core"
import { z } from "zod"
import { errorSchema } from "./types/error"

const c = initContract()

const okResponseSchema = z.object({
  categories: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
    }),
  ),
})

export const categoriesContract = c.router({
  getAll: {
    method: "GET",
    path: "/api/categories",
    responses: {
      200: okResponseSchema,
      500: errorSchema,
    },
  },
  getById: {
    method: "GET",
    path: "/api/categories/:id",
    pathParams: z.object({ id: z.coerce.number() }),
    responses: {
      200: okResponseSchema,
      500: errorSchema,
      404: errorSchema,
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
      201: okResponseSchema,
      500: errorSchema,
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
      200: okResponseSchema,
      500: errorSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },
  delete: {
    method: "DELETE",
    path: "/api/categories/:id",
    pathParams: z.object({ id: z.coerce.number() }),
    responses: {
      200: okResponseSchema,
      500: errorSchema,
      404: errorSchema,
    },
  },
})
