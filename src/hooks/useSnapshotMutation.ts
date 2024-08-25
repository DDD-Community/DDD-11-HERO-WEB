import { createSnapshot, createSnapshotRes, getRecentSnapshot, getSnapshots, snapshot } from "@/api"
import { useMutation, UseMutationResult } from "@tanstack/react-query"

export const useCreateSnaphot = (): UseMutationResult<createSnapshotRes, unknown, snapshot, unknown> => {
  return useMutation({
    mutationFn: (snapshot: snapshot) => {
      return createSnapshot(snapshot)
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })
}

export const useGetSnapshot = (): UseMutationResult<snapshot, unknown, string, unknown> => {
  return useMutation({
    mutationFn: (id: string) => {
      return getSnapshots(id)
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })
}

export const useGetRecentSnapshot = (): UseMutationResult<snapshot, unknown, void, unknown> => {
  return useMutation({
    mutationFn: () => {
      return getRecentSnapshot()
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })
}
