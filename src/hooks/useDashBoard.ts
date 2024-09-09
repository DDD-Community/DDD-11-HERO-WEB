import { getTodayPoseAnalysis, getTotalPoseAnalysis } from "@/api/analysis"
import { useQueries } from "@tanstack/react-query"

export const usePoseAnalysis = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["todayAnalysis"],
        queryFn: getTodayPoseAnalysis,
      },
      {
        queryKey: ["totalAnalysis"],
        queryFn: getTotalPoseAnalysis,
      },
    ],
  })

  const [todayAnalysis, totalAnalysis] = results

  return {
    todayAnalysis: todayAnalysis.data,
    totalAnalysis: totalAnalysis.data,
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
    errors: results.map((result) => result.error).filter(Boolean),
  }
}
