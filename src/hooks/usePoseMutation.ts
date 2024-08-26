import { poseReq, poseRes, sendPose } from "@/api/pose"
import { useMutation, UseMutationResult } from "@tanstack/react-query"

export const useSendPose = (): UseMutationResult<poseRes, unknown, poseReq, unknown> => {
  return useMutation({
    mutationFn: (poseReq: poseReq) => {
      return sendPose(poseReq)
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })
}
