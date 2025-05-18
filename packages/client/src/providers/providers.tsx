import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { tsr } from "../reactQuery"

const queryClient = new QueryClient()

export function Providers({
  children,
}: { children: preact.ComponentChildren }) {
  return (
    <QueryClientProvider client={queryClient}>
      <tsr.ReactQueryProvider>{children}</tsr.ReactQueryProvider>
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="bottom-left"
        position="left"
      />
    </QueryClientProvider>
  )
}
