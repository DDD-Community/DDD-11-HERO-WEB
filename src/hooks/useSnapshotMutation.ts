import { useCreateSnapshotMutation } from "@/api/queries"

/**
 * 스냅샷 생성을 위한 mutation 훅
 * @deprecated 대신 @/api/queries의 useCreateSnapshotMutation 사용 권장
 */
export const useCreateSnaphot = () => {
  return useCreateSnapshotMutation();
}
