import {
  exhaustiveGuard,
  isFetchError,
  isUnknownErrorResponse,
} from "@ts-rest/react-query/v5"
import { useQueryProducts } from "../hooks/useQueryProducts"
import { Product, ProductSkeleton } from "./product"

export function ProductList() {
  const {
    data: products,
    isLoading,
    isError,
    error,
    contractEndpoint,
  } = useQueryProducts()

  if (isError) {
    if (isFetchError(error)) {
      return (
        <div>
          ❌ We could not retrieve the products. Please check your internet
          connection. ❌
        </div>
      )
    }

    if (isUnknownErrorResponse(error, contractEndpoint)) {
      return <p>❌ An unexpected error occurred, please try again later ❌</p>
    }

    if (error.status === 500) {
      return (
        <p>
          ❌ There was an error getting your products, please try again later ❌
        </p>
      )
    }

    // this should be unreachable code if you handle all possible error cases
    // if not, you will get a compile-time error on the line below
    return exhaustiveGuard(error)
  }

  if (isLoading) {
    return (
      <>
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
      </>
    )
  }

  if (products && products.body.products.length > 0) {
    return (
      <>
        {products.body.products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </>
    )
  }

  return <p>No products currently 😒</p>
}
