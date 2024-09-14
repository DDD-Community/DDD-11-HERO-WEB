import { getTodayPoseAnalysis, getTotalPoseAnalysis } from "@/api/analysis"
import { useQueries } from "@tanstack/react-query"
import dayjs from "dayjs"
import { DateValueType } from "react-tailwindcss-datepicker"

export const usePoseAnalysis = (dateRange: DateValueType) => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["todayAnalysis"],
        queryFn: getTodayPoseAnalysis,
      },
      {
        queryKey: ["totalAnalysis", dateRange],
        queryFn: () => {
          const params: { fromDate?: string; toDate?: string } = {}

          if (dateRange?.startDate) {
            params.fromDate = dayjs(dateRange.startDate).format("YYYY-MM-DD")
          }

          if (dateRange?.endDate) {
            params.toDate = dayjs(dateRange.endDate).format("YYYY-MM-DD")
          }

          return getTotalPoseAnalysis(params)
        },
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
