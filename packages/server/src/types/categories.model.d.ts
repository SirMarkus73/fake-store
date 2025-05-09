import type { DatabaseError } from "@/errors/databaseError"
import type { NotFoundError } from "@/errors/notFoundError"
import type { ParameterError } from "@/errors/parameterError"
import type { Category } from "@/types/category"
import type { PromiseResult } from "@/types/promiseResult"

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
