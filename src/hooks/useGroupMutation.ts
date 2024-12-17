import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "@tanstack/react-query"
import {
  checkGroupName,
  createGroup,
  getGroup,
  getGroups,
  group,
  groupJoinReq,
  groupJoinRes,
  groupsReq,
  groupsRes,
  joinGroup,
  modifyGroup,
} from "@/api"

export const useGetGroups = (params: groupsReq): UseQueryResult<groupsRes, Error> => {
  // eslint-disable-next-line max-len
  return useQuery<groupsRes, Error>({
    queryKey: ["groups", params.page, params.size, params.sort, params.keyword],
    queryFn: () => getGroups(params),
  })
}

export const useGetGroup = (id: number | undefined): UseQueryResult<group, Error> => {
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

export const useCreateGroup = (): UseMutationResult<group, unknown, group, unknown> => {
  return useMutation({
    mutationFn: (group: group) => {
      return createGroup(group)
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })
}

export const useModifyGroup = (): UseMutationResult<group, unknown, group, unknown> => {
  return useMutation({
    mutationFn: (group: group) => {
      return modifyGroup(group)
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })
}
