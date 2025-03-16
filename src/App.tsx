// dependencies
import { Router } from "@/routes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import ModalsProvider from "./providers/ModalsProvider"
import { init } from "@amplitude/analytics-browser"
import { useEffect } from "react"

const AMPLITUDE_KEY = import.meta.env.VITE_AMPLITUDE_KEY

const queryClient = new QueryClient()

const App = (): React.ReactElement => {
  useEffect(() => {
    init(AMPLITUDE_KEY, {
      defaultTracking: false,
    })
  }, [])
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
