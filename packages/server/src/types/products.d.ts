export interface BaseProduct {
  id: number
  name: string
  price: number
}

export interface ProductWithCategoryIds extends BaseProduct {
  categories?: number[]
}

export interface ProductWithCategoryList extends BaseProduct {
  categories: string[]
}
