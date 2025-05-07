import { CategoriesController } from "@/controllers/categories.controller"
import { Router } from "express"

export const categoriesRouter = Router()

const categoriesController = new CategoriesController()

categoriesRouter.get("/", categoriesController.getAll)
categoriesRouter.get("/:id", categoriesController.getById)

categoriesRouter.post("/", categoriesController.post)

categoriesRouter.delete("/:id", categoriesController.delete)

categoriesRouter.patch("/:id", categoriesController.patch)
