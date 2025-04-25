import { notification, getNotification, registerNotification } from '../notification';
import { useMutation, useQuery, QueryOptions, MutationOptions, queryKeys } from './index';
import { useInvalidateQueries } from './index';

/**
 * 알림 설정을 가져오는 쿼리 훅
 */
export const useNotificationQuery = (options?: QueryOptions<{ data: notification }>) => {
  return useQuery({
    queryKey: queryKeys.notification.settings,
    queryFn: () => getNotification(),
    ...options,
  });
};

/**
 * 알림 설정을 등록/업데이트하는 mutation 훅
 */
export const useRegisterNotificationMutation = (options?: MutationOptions<notification, notification>) => {
  const invalidateQueries = useInvalidateQueries();
  
  return useMutation({
    mutationFn: (data: notification) => registerNotification(data),
    onSuccess: (data, variables, context) => {
      // 알림 설정 업데이트 후 관련 쿼리 무효화
      invalidateQueries.invalidateNotification();
      
      // 사용자 정의 onSuccess 핸들러 호출
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
}; 