import { initContract } from "@ts-rest/core"
import { z } from "zod"
import { errorSchema } from "./types/error"

const c = initContract()

const okResponseSchema = z.object({
  products: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      price: z.number(),
      categories: z.array(z.string()),
    }),
  ),
})

export const productsContract = c.router({
  getAll: {
    method: "GET",
    path: "/api/products",
    responses: {
      200: okResponseSchema,
      500: errorSchema,
    },
  },
  getById: {
    method: "GET",
    path: "/api/products/:id",
    pathParams: z.object({ id: z.coerce.number() }),
    responses: {
      200: okResponseSchema,
      500: errorSchema,
      404: errorSchema,
    },
  },
  post: {
    method: "POST",
    path: "/api/products",
    body: z.object({
      name: z.string(),
      price: z.number(),
      categories: z.array(z.number()).optional(),
    }),
    responses: {
      201: okResponseSchema,
      500: errorSchema,
    },
  },
  patch: {
    method: "PATCH",
    path: "/api/products/:id",
    pathParams: z.object({ id: z.coerce.number() }),
    body: z.object({
      name: z.string().optional(),
      price: z.number().optional(),
      categories: z.array(z.number()).optional(),
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
    path: "/api/products/:id",
    pathParams: z.object({ id: z.coerce.number() }),
    responses: {
      200: okResponseSchema,
      500: errorSchema,
      404: errorSchema,
    },
  },
})
