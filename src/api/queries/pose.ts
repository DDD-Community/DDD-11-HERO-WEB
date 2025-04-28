import { poseReq, poseRes, sendPose } from '../pose';
import { MutationOptions, useInvalidateQueries, useMutation } from './index';

/**
 * 자세 데이터 전송을 위한 mutation 훅
 */
export const useSendPoseMutation = (options?: MutationOptions<poseRes, poseReq>) => {
  const invalidateQueries = useInvalidateQueries();
  
  return useMutation({
    mutationFn: (data: poseReq) => sendPose(data),
    onSuccess: (data, variables, context) => {
      // 포즈 데이터 생성 후 관련 쿼리 무효화
      invalidateQueries.invalidatePose();
      invalidateQueries.invalidateAnalysis();
      
      // 사용자 정의 onSuccess 핸들러 호출
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
}; 