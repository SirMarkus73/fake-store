import { initContract } from "@ts-rest/core"
import { categoriesContract } from "./categories"
import { productsContract } from "./products"

const c = initContract()

export const allContract = c.router({
  products: productsContract,
  categories: categoriesContract,
})
