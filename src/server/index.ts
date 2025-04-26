import express from "express"

import { json } from "express"
import { PORT } from "@/lib/envConfig"
import { productsRouter } from "@routes/products"

const app = express()

app.use(json())

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Fake Store API!")
})

app.use("/products", productsRouter)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
