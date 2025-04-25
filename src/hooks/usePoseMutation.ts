import { useSendPoseMutation } from "@/api/queries"

/**
 * 자세 데이터 전송을 위한 mutation 훅
 * @deprecated 대신 @/api/queries의 useSendPoseMutation 사용 권장
 */
export const useSendPose = () => {
  return useSendPoseMutation();
}
