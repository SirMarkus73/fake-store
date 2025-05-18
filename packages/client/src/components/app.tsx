import { useQueryProducts } from "../hooks/useQueryProducts"
import { Button } from "./button"
import { CreateProductForm } from "./createProductForm"
import { ProductList } from "./productList"

export function App() {
  const { isFetching, refetch } = useQueryProducts()

  return (
    <main className="grid min-h-dvh place-items-center bg-gradient-to-br from-gray-300 to-gray-400">
      <CreateProductForm />
      <section className="flex flex-wrap gap-4">
        <ProductList />
      </section>
      <Button type="button" disabled={isFetching} onClick={() => refetch()}>
        Refresh products
      </Button>
    </main>
  )
}
