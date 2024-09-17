// dependencies
import { Router } from "@/routes"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ModalsProvider from "./providers/ModalsProvider"

const queryClient = new QueryClient()

const App = (): React.ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalsProvider>
        <Router />
      </ModalsProvider>
    </QueryClientProvider>
  )
}

export default App
