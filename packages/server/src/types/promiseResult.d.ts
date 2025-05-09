import type { Result } from "neverthrow"

export type PromiseResult<Value, Error> = Promise<Result<Value, Error>>
