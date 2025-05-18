import path from "node:path"
import { fileURLToPath } from "node:url"
import { PORT } from "@server/lib/envConfig"
import { categoriesRouter } from "@server/routes/categories"
import { productsRouter } from "@server/routes/products"
import { allContract } from "@shared/contracts/all"
import { categoriesContract } from "@shared/contracts/categories"
import { productsContract } from "@shared/contracts/products"
import { createExpressEndpoints } from "@ts-rest/express"
import { generateOpenApi } from "@ts-rest/open-api"
import express, { json } from "express"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(json())

app.use(express.static(path.join(__dirname, "../../client/dist")))

const openApiDocument = generateOpenApi(allContract, {
  info: {
    title: "Fake-Store API",
    version: "1.0.0",
  },
})

// @ts-expect-error: Ignore type error for openApiDocument serialization
app.get("/api/spec.json", (_, res) => res.json(openApiDocument))

import { apiReference } from "@scalar/express-api-reference"

app.use(
  "/api/docs",
  apiReference({
    // Put your OpenAPI url here:
    url: "/api/spec.json",
    theme: "deepSpace",
  }),
)

// All routes except ones that starts with /api
app.get(/^\/(?!api).*/, (_, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"))
})

// Basic route
app.get("/api", (_req, res) => {
  res.send("Welcome to the Fake Store API!")
})

createExpressEndpoints(productsContract, productsRouter, app)
createExpressEndpoints(categoriesContract, categoriesRouter, app)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
