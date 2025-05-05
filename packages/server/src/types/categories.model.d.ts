import type { DatabaseError } from "@/errors/databaseError"
import type { NotFoundError } from "@/errors/notFoundError"
import type { Category } from "@/types/category"
import type { PromiseResult } from "@/types/promiseResult"

export type GetAllResult = PromiseResult<Category[], DatabaseError>
export type GetByIdResult = PromiseResult<
  Category[],
  DatabaseError | NotFoundError
>
export type PostResult = PromiseResult<Category[], DatabaseError>
export type DeleteResult = PromiseResult<Category[], DatabaseError>

export interface GetByIdParams {
  id: number
}

export interface PostParams {
  name: string
  description: string
}

export interface DeleteParams {
  id: number
}
