import type { DatabaseError } from "@/errors/databaseError"
import type { NotFoundError } from "@/errors/notFoundError"
import type { ProductWithCategoryList } from "@/types/products"
import type { PromiseResult } from "@/types/promiseResult"

export type GetAllResult = PromiseResult<
  ProductWithCategoryList[],
  DatabaseError
>

export type GetByIdResult = PromiseResult<
  ProductWithCategoryList[],
  DatabaseError | NotFoundError
>

export type PostResult = PromiseResult<
  ProductWithCategoryList[],
  DatabaseError | ForeignKeyError
>

export type DeleteResult = PromiseResult<
  ProductWithCategoryList[],
  DatabaseError
>

export type ParseProductsResult = Promise<ProductWithCategoryList[]>

export interface GetByIdParams {
  id: number
}

export interface PostParams {
  name: string
  price: number
  categories?: number[]
}

export interface DeleteParams {
  id: number
}

export interface ParseProductsParams {
  products: ProductWithCategory[]
}
