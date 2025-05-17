import { tsr } from "../reactQuery"
import { Button } from "./button"
import { Product, ProductSkeleton } from "./product"

export function App() {
  const {
    data: products,
    isLoading,
    isFetching,
    refetch,
  } = tsr.products.getAll.useQuery({
    queryKey: ["products"],
    refetchOnWindowFocus: false,
  })

  return (
    <main className="grid min-h-dvh place-items-center bg-gradient-to-br from-gray-300 to-gray-400">
      <section className="flex flex-wrap gap-4">
        {!isLoading &&
          products &&
          products.body.products.length > 0 &&
          products.body.products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        {isLoading && (
          <>
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </>
        )}
        {!isLoading && products?.body.products.length === 0 && (
          <p>No products currently 😒</p>
        )}
      </section>
      <Button disabled={isFetching} onClick={() => refetch()} />
    </main>
  )
}
