import { useCreateSnapshotMutation, useRecentSnapshotQuery, useSnapshotQuery, keypointsToPoints, pointsToKeypoints } from "@/api/queries";
import { snapshot } from "@/api/snapshot";
import { useSnapShotStore } from "@/store/SnapshotStore";
import { useEffect } from "react";

/**
 * 스냅샷 관련 기능을 통합한 훅
 */
export default function useSnapshot() {
  const { 
    snapshot: snapshotInStore, 
    setSnapShot, 
    resetSnapShot,
    isInitialSnapShotExist 
  } = useSnapShotStore();
  
  // 일단 메모리에서 id 생성 (실제로는 서버에서 id를 받아와야 함)
  const snapshotId = isInitialSnapShotExist ? 'memory-snapshot' : '';

  // 최근 스냅샷 데이터 쿼리
  const {
    data: recentSnapshot,
    isLoading: isLoadingRecent,
    error: recentError,
    refetch: refetchRecent
  } = useRecentSnapshotQuery({
    // 최근 스냅샷이 없는 경우 에러 발생하지 않도록 설정
    retry: false,
  });

  // 특정 ID의 스냅샷 쿼리 (현재 스냅샷 ID가 있을 때만 실행)
  const {
    data: specificSnapshot,
    isLoading: isLoadingSpecific,
    error: specificError,
    refetch: refetchSpecific
  } = useSnapshotQuery(
    snapshotId, 
    {
      enabled: !!snapshotId && snapshotId !== 'memory-snapshot',
    }
  );

  // 스냅샷 생성 뮤테이션
  const createSnapshotMutation = useCreateSnapshotMutation();

  // 스냅샷이 변경되면 스토어 업데이트
  useEffect(() => {
    if (specificSnapshot && specificSnapshot.points) {
      setSnapShot(pointsToKeypoints(specificSnapshot.points));
    } else if (recentSnapshot && recentSnapshot.points) {
      setSnapShot(pointsToKeypoints(recentSnapshot.points));
    }
  }, [recentSnapshot, specificSnapshot, setSnapShot]);

  const createSnapshot = async (data: snapshot) => {
    try {
      const result = await createSnapshotMutation.mutateAsync(data);
      if (result && result.id && data.points) {
        // 서버에서 ID를 받아온 후 로컬에 저장
        setSnapShot(pointsToKeypoints(data.points));
      }
      return true;
    } catch (error) {
      console.error("Failed to create snapshot:", error);
      return false;
    }
  };

  return {
    snapshotData: snapshotInStore ? { 
      id: snapshotId,
      points: keypointsToPoints(snapshotInStore) 
    } : null,
    setSnapshotData: (data: snapshot) => {
      if (data.points) {
        setSnapShot(pointsToKeypoints(data.points));
      }
    },
    resetSnapshotData: resetSnapShot,
    createSnapshot,
    isLoading: isLoadingRecent || isLoadingSpecific || createSnapshotMutation.isPending,
    error: recentError || specificError || createSnapshotMutation.error,
    refetch: () => {
      if (snapshotId && snapshotId !== 'memory-snapshot') {
        refetchSpecific();
      } else {
        refetchRecent();
      }
    }
  };
}
