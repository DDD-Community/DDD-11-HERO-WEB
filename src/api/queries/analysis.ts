import { getTodayPoseAnalysis, getTotalPoseAnalysis, TodayAnalysisData, TotalAnalysisData } from '../analysis';
import { useQuery, QueryOptions, queryKeys } from './index';
import dayjs from 'dayjs';
import { DateValueType } from 'react-tailwindcss-datepicker';

/**
 * 오늘의 자세 분석 데이터를 가져오는 쿼리 훅
 */
export const useTodayPoseAnalysisQuery = (options?: QueryOptions<TodayAnalysisData>) => {
  return useQuery({
    queryKey: queryKeys.analysis.today,
    queryFn: getTodayPoseAnalysis,
    ...options,
  });
};

/**
 * 기간별 자세 분석 데이터를 가져오는 쿼리 훅
 */
export const useTotalPoseAnalysisQuery = (
  dateRange: DateValueType,
  options?: QueryOptions<TotalAnalysisData>
) => {
  const params: { fromDate?: string; toDate?: string } = {};
  
  if (dateRange?.startDate) {
    params.fromDate = dayjs(dateRange.startDate).format('YYYY-MM-DD');
  }
  
  if (dateRange?.endDate) {
    params.toDate = dayjs(dateRange.endDate).format('YYYY-MM-DD');
  }
  
  return useQuery({
    queryKey: queryKeys.analysis.total(params),
    queryFn: () => getTotalPoseAnalysis(params),
    enabled: !!dateRange?.startDate && !!dateRange?.endDate, // 시작일과 종료일이 모두 있을 때만 쿼리 실행
    ...options,
  });
};

/**
 * 오늘 및 기간별 자세 분석 데이터를 한 번에 가져오는 훅
 */
export const usePoseAnalysis = (dateRange: DateValueType) => {
  const todayAnalysisQuery = useTodayPoseAnalysisQuery();
  const totalAnalysisQuery = useTotalPoseAnalysisQuery(dateRange);

  return {
    todayAnalysis: todayAnalysisQuery.data,
    totalAnalysis: totalAnalysisQuery.data,
    isLoading: todayAnalysisQuery.isLoading || totalAnalysisQuery.isLoading,
    isError: todayAnalysisQuery.isError || totalAnalysisQuery.isError,
    errors: [
      todayAnalysisQuery.error,
      totalAnalysisQuery.error
    ].filter(Boolean),
    refetch: () => {
      todayAnalysisQuery.refetch();
      totalAnalysisQuery.refetch();
    },
  };
}; 