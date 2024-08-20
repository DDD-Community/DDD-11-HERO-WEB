// dependencies
import { Router } from "@/routes"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

const App = (): React.ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router></Router>
    </QueryClientProvider>
  )
}

export default App
