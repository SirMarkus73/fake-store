export class ProductsModel {
  #products = [
    {
      id: 1,
      name: "Watch",
      price: 120.4,
    },
    {
      id: 2,
      name: "T-Shirt",
      price: 11.99,
    },
    {
      id: 3,
      name: "Jeans",
      price: 13.54,
    },
  ]

  getAll() {
    return this.#products
  }

  getById(id: number) {
    const selectedProduct = this.#products.find((product) => product.id === id)

    if (selectedProduct === undefined) {
      throw new Error("Product not found")
    }

    return selectedProduct
  }

  insert(name: string, price: number) {
    const lastId = this.#products[this.#products.length - 1].id
    this.#products.push({ id: lastId + 1, name, price })

    return this.#products[this.#products.length - 1]
  }
}
