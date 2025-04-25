import { snapshot, createSnapshot, getSnapshots, getRecentSnapshot, createSnapshotRes, point, position } from '../snapshot';
import { keypoint } from '@/utils';
import { useMutation, useQuery, QueryOptions, MutationOptions, queryKeys } from './index';
import { useInvalidateQueries } from './index';

// keypoint[] 배열을 point[] 배열로 변환하는 헬퍼 함수
const keypointsToPoints = (keypoints: keypoint[] | null): point[] => {
  if (!keypoints) return [];
  
  return keypoints.map(kp => ({
    position: kp.name as position,
    x: kp.x,
    y: kp.y
  }));
};

// point[] 배열을 keypoint[] 배열로 변환하는 헬퍼 함수
const pointsToKeypoints = (points: point[] | undefined): keypoint[] => {
  if (!points) return [];
  
  return points.map(p => ({
    name: p.position,
    x: p.x,
    y: p.y,
    confidence: 1 // 기본 confidence 값 설정
  }));
};

/**
 * 최근 스냅샷을 가져오는 쿼리 훅
 */
export const useRecentSnapshotQuery = (options?: QueryOptions<snapshot>) => {
  return useQuery({
    queryKey: queryKeys.snapshot.recent,
    queryFn: () => getRecentSnapshot(),
    ...options,
  });
};

/**
 * 특정 ID의 스냅샷을 가져오는 쿼리 훅
 */
export const useSnapshotQuery = (id: string, options?: QueryOptions<snapshot>) => {
  return useQuery({
    queryKey: [...queryKeys.snapshot.all, id],
    queryFn: () => getSnapshots(id),
    enabled: !!id, // id가 유효할 때만 쿼리 실행
    ...options,
  });
};

/**
 * 스냅샷을 생성하는 mutation 훅
 */
export const useCreateSnapshotMutation = (options?: MutationOptions<createSnapshotRes, snapshot>) => {
  const invalidateQueries = useInvalidateQueries();
  
  return useMutation({
    mutationFn: (data: snapshot) => createSnapshot(data),
    onSuccess: (data, variables, context) => {
      // 스냅샷 생성 후 관련 쿼리 무효화
      invalidateQueries.invalidateSnapshot();
      
      // 사용자 정의 onSuccess 핸들러 호출
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

// 변환 유틸리티 함수 export
export { keypointsToPoints, pointsToKeypoints }; 