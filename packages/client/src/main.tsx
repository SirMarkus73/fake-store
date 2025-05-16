import { render } from "preact"
import { App } from "./components/app/app"
import { Providers } from "./providers/providers"

render(
  <Providers>
    <App />
  </Providers>,
  // biome-ignore lint/style/noNonNullAssertion: <Code from Preat+Vite template>
  document.getElementById("app")!,
)
