import preact from "@preact/preset-vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Redirect /api to the express app on development (change the port if doesn't use 3000 as port)
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
