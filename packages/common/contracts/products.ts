import { initContract } from "@ts-rest/core"
import { z } from "zod"

const c = initContract()

export const productsContract = c.router({
  getAll: {
    method: "GET",
    path: "/api/products",
    responses: {
      200: z.object({
        products: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            price: z.number(),
            categories: z.array(z.string()),
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
    path: "/api/products/:id",
    pathParams: z.object({ id: z.coerce.number() }),
    responses: {
      200: z.object({
        products: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            price: z.number(),
            categories: z.array(z.string()),
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
    path: "/api/products",
    body: z.object({
      name: z.string(),
      price: z.number(),
      categories: z.array(z.number()),
    }),
    responses: {
      201: z.object({
        products: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            price: z.number(),
            categories: z.array(z.string()),
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
    path: "/api/products/:id",
    pathParams: z.object({ id: z.coerce.number() }),
    body: z.object({
      name: z.string().optional(),
      price: z.number().optional(),
      categories: z.array(z.number()).optional(),
    }),
    responses: {
      200: z.object({
        products: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            price: z.number(),
            categories: z.array(z.string()),
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
    path: "/api/products/:id",
    pathParams: z.object({ id: z.coerce.number() }),
    responses: {
      200: z.object({
        products: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            price: z.number(),
            categories: z.array(z.string()),
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
