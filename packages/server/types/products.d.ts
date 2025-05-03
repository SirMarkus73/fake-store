export interface BaseProduct {
  id: number
  name: string
  price: number
}

export interface ProductWithCategory extends BaseProduct {
  category: string | null
}

export interface ProductWithCategoryList extends BaseProduct {
  categories: string[]
}
