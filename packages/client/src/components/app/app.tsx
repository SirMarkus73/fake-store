import { tsr } from "../../reactQuery"

export function App() {
  const {
    data: products,
    isPending,
    isFetching,
    refetch,
  } = tsr.products.getAll.useQuery({
    queryKey: ["products"],
    refetchOnWindowFocus: false,
  })

  if (isPending) {
    return <div>Loading Products...</div>
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-gray-200">
      <section className="flex flex-wrap gap-4">
        {products && products.body.products.length > 0 ? (
          products.body.products.map((product) => (
            <article
              key={product.id}
              className="flex flex-col rounded-md bg-gray-50 p-8 transition-transform hover:scale-105"
            >
              <h1 className="text-2xl capitalize">{product.name}</h1>
              <h2 className="my-3 text-3xl">
                <span className="underline decoration-1 decoration-gray-400 decoration-wavy">
                  {product.price}
                </span>{" "}
                €{" "}
              </h2>

              {product.categories.length > 0 && (
                <section>
                  <h1 className="pb-2 text-lg">Categories:</h1>
                  <hr className="border-t-2 border-dotted" />
                  <ul className="rounded-b-md bg-gray-200/80 p-2">
                    {product.categories.map((category) => (
                      <li
                        key={category}
                        className="list-inside list-disc text-sm "
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </article>
          ))
        ) : (
          <article>
            <h1>There is no products currently.</h1>
          </article>
        )}
      </section>

      <button
        type="button"
        className={
          "cursor-pointer rounded-md bg-gray-500 p-2 text-white transition-[transform_colors] hover:scale-110 hover:bg-gray-700 disabled:cursor-default disabled:bg-gray-300"
        }
        disabled={isFetching}
        onClick={() => refetch()}
      >
        Refresh products
      </button>
    </main>
  )
}
