import preact from "@preact/preset-vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    tailwindcss(),
    tsconfigPaths({ projects: ["../../tsconfig.json"] }),
  ],
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
