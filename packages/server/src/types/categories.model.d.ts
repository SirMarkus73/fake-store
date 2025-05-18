import type { DatabaseError } from "@server/errors/databaseError"
import type { NotFoundError } from "@server/errors/notFoundError"
import type { ParameterError } from "@server/errors/parameterError"
import type { PromiseResult } from "@server/types/promiseResult"
import type { Category } from "@shared/types/category"

export type GetAllResult = PromiseResult<Category[], DatabaseError>
export type GetByIdResult = PromiseResult<
  Category[],
  DatabaseError | NotFoundError
>
export type PostResult = PromiseResult<Category[], DatabaseError>
export type PatchResult = PromiseResult<
  Category[],
  DatabaseError | ParameterError
>
export type DeleteResult = PromiseResult<Category[], DatabaseError>

export interface GetByIdParams {
  id: number
}

export interface PostParams {
  name: string
  description: string
}

export type PatchParams = Partial<Omit<Category, "id">> &
  Required<Pick<Category, "id">>

export interface DeleteParams {
  id: number
}
