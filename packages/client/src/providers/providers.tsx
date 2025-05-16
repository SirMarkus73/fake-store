import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type Preact from "preact"
import { tsr } from "../reactQuery"

const queryClient = new QueryClient()

export function Providers({
  children,
}: { children: Preact.ComponentChildren }) {
  return (
    <QueryClientProvider client={queryClient}>
      <tsr.ReactQueryProvider>{children}</tsr.ReactQueryProvider>
    </QueryClientProvider>
  )
}
