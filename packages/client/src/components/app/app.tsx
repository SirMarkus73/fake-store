import "./app.css"
import { tsr } from "../../reactQuery"

export function App() {
  const {
    data: products,
    isPending,
    refetch,
  } = tsr.products.getAll.useQuery({
    queryKey: ["products"],
    refetchOnWindowFocus: false,
  })

  console.log(products)

  if (isPending) {
    return <div>Loading Products...</div>
  }

  return (
    <>
      <section className="product-list">
        {products && products.body.products.length > 0 ? (
          products.body.products.map((product) => (
            <article key={product.id} className="product">
              <h1>{product.name}</h1>
              <small>{product.price} € </small>
              {product.categories.length > 0 && (
                <section>
                  <h1>Categories:</h1>
                  <ul>
                    {product.categories.map((category) => (
                      <li key={category}>{category}</li>
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

      <button type="button" class="refresh-button" onClick={() => refetch()}>
        Refresh products
      </button>
    </>
  )
}
