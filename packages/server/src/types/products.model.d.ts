import type {
  DatabaseError,
  ForeignKeyError,
} from "@server/errors/databaseError"
import type { NotFoundError } from "@server/errors/notFoundError"
import type { ParameterError } from "@server/errors/parameterError"
import type { PromiseResult } from "@server/types/promiseResult"
import type {
  ProductWithCategoryIds,
  ProductWithCategoryList,
} from "@shared/types/products"

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
