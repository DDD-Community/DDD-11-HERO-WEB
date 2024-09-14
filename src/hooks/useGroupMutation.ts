import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "@tanstack/react-query"
import {
  checkGroupName,
  getGroup,
  getGroups,
  group,
  groupJoinReq,
  groupJoinRes,
  groupsReq,
  groupsRes,
  joinGroup,
} from "@/api"

export const useGetGroups = (params: groupsReq): UseQueryResult<groupsRes, Error> => {
  // eslint-disable-next-line max-len
  return useQuery<groupsRes, Error>({ queryKey: ["groups", params], queryFn: () => getGroups(params) })
}

export const useGetGroup = (id: number): UseQueryResult<group, Error> => {
  // eslint-disable-next-line max-len
  return useQuery<group, Error>({ queryKey: ["group", id], queryFn: () => getGroup(id) })
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

export const useCheckGroupName = (): UseMutationResult<boolean, unknown, string, unknown> => {
  return useMutation({
    mutationFn: (name: string) => {
      return checkGroupName(name)
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })
}
