// dependencies
import { Router } from "@/routes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import ModalsProvider from "./providers/ModalsProvider"

const queryClient = new QueryClient()

const App = (): React.ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <ModalsProvider>
        <Router />
      </ModalsProvider>
    </QueryClientProvider>
  )
}

export default App
