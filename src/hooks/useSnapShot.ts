import { createSnapshot, createSnapshotRes, getRecentSnapshot, getSnapshots, snapshot } from "@/api"
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "@tanstack/react-query"

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

export const useGetRecentSnapshot = (): UseQueryResult<snapshot, Error> => {
  return useQuery<snapshot, Error>({
    queryKey: ["recent-snapshot"],
    queryFn: getRecentSnapshot,
  })
}
