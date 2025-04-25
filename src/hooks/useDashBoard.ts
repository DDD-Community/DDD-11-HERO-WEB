import { usePoseAnalysis as usePoseAnalysisQuery } from "@/api/queries"
import type { DateValueType } from "react-tailwindcss-datepicker"

/**
 * Dashboard에서 자세 분석 데이터를 가져오는 훅
 * 리팩토링 후 직접 api/queries에서 가져오는 훅을 사용합니다.
 */
export const usePoseAnalysis = (dateRange: DateValueType) => {
  // 리팩토링된 훅 사용
  return usePoseAnalysisQuery(dateRange);
}
