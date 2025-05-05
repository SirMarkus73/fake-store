import path from "node:path"
import { fileURLToPath } from "node:url"

import { PORT } from "@/lib/envConfig"
import { categoriesRouter } from "@routes/categories"
import { productsRouter } from "@routes/products"

import express from "express"
import { json } from "express"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(json())

app.use(express.static(path.join(__dirname, "../../client/dist")))

// All routes except ones that starts with /api
app.get(/^\/(?!api).*/, (_, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"))
})

// Basic route
app.get("/api", (_req, res) => {
  res.send("Welcome to the Fake Store API!")
})

app.use("/api/products", productsRouter)
app.use("/api/categories", categoriesRouter)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
