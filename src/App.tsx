// dependencies
import { Router } from "@/routes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import ModalsProvider from "./providers/ModalsProvider"
import { init } from "@amplitude/analytics-browser"
import { useEffect } from "react"

const AMPLITUDE_KEY = import.meta.env.VITE_AMPLITUDE_KEY

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분 동안 데이터를 fresh로 간주
      retry: 2, // 실패 시 최대 2번 재시도
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리패치 비활성화
      gcTime: 5 * 60 * 1000, // 5분 동안 비활성 캐시 보존
    },
    mutations: {
      retry: 1, // 실패 시 최대 1번 재시도
    },
  },
})

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
