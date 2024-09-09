import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "@tanstack/react-query"
import { getGroups, groupJoinReq, groupJoinRes, groupsReq, groupsRes, joinGroup } from "@/api"

export const useGetGroups = (params: groupsReq): UseQueryResult<groupsRes, Error> => {
  // eslint-disable-next-line max-len
  return useQuery<groupsRes, Error>({ queryKey: ["groups", params], queryFn: () => getGroups(params) })
}

export const useJoinGroup = (): UseMutationResult<groupJoinRes, unknown, groupJoinReq, unknown> => {
  return useMutation({
    mutationFn: (groupJoinReq: groupJoinReq) => {
      return joinGroup(groupJoinReq)
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })
}
