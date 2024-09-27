import { createSnapshot, createSnapshotRes, snapshot } from "@/api"
import { useMutation, UseMutationResult } from "@tanstack/react-query"

export const useCreateSnaphot = (): UseMutationResult<createSnapshotRes, unknown, snapshot, unknown> => {
  return useMutation({
    mutationFn: (_snapshot: snapshot) => {
      return createSnapshot(_snapshot)
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })
}
