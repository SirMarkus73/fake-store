import type { DatabaseError, ForeignKeyError } from "@/errors/databaseError"
import type { NotFoundError } from "@/errors/notFoundError"
import type { ParameterError } from "@/errors/parameterError"
import type {
  ProductWithCategoryIds,
  ProductWithCategoryList,
} from "@/types/products"
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

export type PatchResult = PromiseResult<
  ProductWithCategoryList[],
  DatabaseError | NotFoundError | ParameterError | ForeignKeyError
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

export type PatchParams = Partial<Omit<ProductWithCategoryIds, "id">> &
  Required<Pick<ProductWithCategoryIds, "id">>

export interface DeleteParams {
  id: number
}

export interface ParseProductsParams {
  products: ProductWithCategoryName[]
}
