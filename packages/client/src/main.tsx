import { render } from "preact"
import { App } from "./components/app"
import { Providers } from "./providers/providers"

render(
  <Providers>
    <App />
  </Providers>,
  document.getElementById("app") as HTMLElement,
)
