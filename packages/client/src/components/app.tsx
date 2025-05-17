import { tsr } from "../reactQuery"
import { Button } from "./button"
import { ProductList } from "./productList"

export function App() {
  const { isFetching, refetch } = tsr.products.getAll.useQuery({
    queryKey: ["products"],
    refetchOnWindowFocus: false,
  })

  return (
    <main className="grid min-h-dvh place-items-center bg-gradient-to-br from-gray-300 to-gray-400">
      <section className="flex flex-wrap gap-4">
        <ProductList />
      </section>
      <Button disabled={isFetching} onClick={() => refetch()} />
    </main>
  )
}
