import { ProductsModel } from "../models/products.model"

export class ProductsController {
    productsModel = new ProductsModel

    getAll() {
        return this.productsModel.getAll() 
    }

    getById(id: number) {
        
        try {
            const product = this.productsModel.getById(id)
            return product
        } catch {
            throw new Error("404, Product not found.")
        }
    }

    post(name: string, price: number) {
        return this.productsModel.insert(name, price)
    } 
}