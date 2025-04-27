import { render } from "preact"
import "./index.css"
import { App } from "./app.tsx"

// biome-ignore lint/style/noNonNullAssertion: <Code from Preat+Vite template>
render(<App />, document.getElementById("app")!)
