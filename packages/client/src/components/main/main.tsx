import { render } from "preact"
import "./index.css"
import { App } from "../app/app.tsx"
import { Providers } from "../providers/providers.tsx"

render(
  <Providers>
    <App />
  </Providers>,
  // biome-ignore lint/style/noNonNullAssertion: <Code from Preat+Vite template>
  document.getElementById("app")!,
)
