import { useState, useEffect } from "preact/hooks"
import "./app.css"

interface Product {
  id: number
  name: string
  price: number
}

export function App() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch("/api/products").then((res) =>
      res.json().then((data) => {
        setProducts(data.products)
      }),
    )
  }, [])

  console.log(products)

  return (
    <section>
      {products.length > 0 ? (
        products.map((product) => (
          <article key={product.id}>
            <h1>{product.name}</h1>
            <small>{product.price}€</small>
          </article>
        ))
      ) : (
        <article>
          <h1>There is no products currently.</h1>
        </article>
      )}
    </section>
  )
}
