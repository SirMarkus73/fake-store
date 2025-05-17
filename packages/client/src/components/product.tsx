import type { ProductWithCategoryList } from "../../../common/types/products"

export function ProductSkeleton() {
  return (
    <article className="flex animate-pulse flex-col rounded-md bg-gray-50/30 p-8 backdrop-blur-lg transition-transform hover:scale-105">
      <h1 className="text-2xl capitalize">Loading...</h1>
      <h2 className="my-3 font-semibold text-3xl">
        <span className="underline decoration-1 decoration-gray-400 decoration-wavy">
          0000
        </span>
        €
      </h2>

      <section>
        <h1 className="pb-2 text-lg">Categories:</h1>
        <hr className="border-t-2 border-dotted" />
        <ul className="rounded-b-md bg-gray-200/80 p-2">
          <li className="list-inside list-disc text-sm ">Loading...</li>
          <li className="list-inside list-disc text-sm ">Loading...</li>
        </ul>
      </section>
    </article>
  )
}

export function Product({ product }: { product: ProductWithCategoryList }) {
  return (
    <article className="flex flex-col rounded-md bg-gray-50/30 p-8 backdrop-blur-lg transition-transform hover:scale-105">
      <h1 className="text-2xl capitalize">{product.name}</h1>
      <h2 className="my-3 font-semibold text-3xl">
        <span className="underline decoration-1 decoration-gray-400 decoration-wavy">
          {product.price}
        </span>
        €
      </h2>

      {product.categories.length > 0 && (
        <section>
          <h1 className="pb-2 text-lg">Categories:</h1>
          <hr className="border-t-2 border-dotted" />
          <ul className="rounded-b-md bg-gray-200/80 p-2">
            {product.categories.map((category) => (
              <li key={category} className="list-inside list-disc text-sm ">
                {category}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
