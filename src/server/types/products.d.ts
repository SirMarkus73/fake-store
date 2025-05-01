export interface Product {
  id: number
  name: string
  price: number
}

export interface ProductWithCategories extends Product {
  categories: number[]
}
